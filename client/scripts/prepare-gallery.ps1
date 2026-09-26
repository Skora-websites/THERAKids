# Copy the THERAkids photo drop into client/public/images/gallery/therakids,
# resized + re-encoded as JPEG so the gallery page stays fast.
# Videos (.mp4) and HEIC are skipped.
param(
  [string]$Src = 'C:\Users\shubh\Downloads\THERAkids Gallery',
  [string]$Dst = 'D:\Skora Websites\Thera-Kids\client\public\images\gallery\therakids'
)

Add-Type -AssemblyName System.Drawing

$maxDim = 1600
$quality = 82L

# Source folder -> output slug (also drives the gallery category grouping)
$map = @{
  'THERAkids Noida Centre'  = 'noida-centre'
  'THERAkids GNW Centre'    = 'gnw-centre'
  'Autism Day celebration'  = 'autism-day'
  'Birthday celebration'    = 'birthday'
  'Christmas Day'           = 'christmas'
  'Diwali photos'           = 'diwali'
  'Founder_s Day'           = 'founders-day'
  'Holi celebration'        = 'holi'
  'Happy movements'         = 'happy-moments'
  'Workshop'                = 'workshop'
  'Activities'              = 'activities'
}

if (Test-Path $Dst) { Remove-Item -Recurse -Force $Dst }
New-Item -ItemType Directory -Path $Dst | Out-Null

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

$index = @{}
$skipped = 0
$copied = 0

Get-ChildItem -Path $Src -Directory | ForEach-Object {
  $folder = $_.Name
  if (-not $map.ContainsKey($folder)) { Write-Warning "No mapping for folder: $folder"; return }
  $slug = $map[$folder]

  Get-ChildItem -Path $_.FullName -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png)$' } | Sort-Object Name | ForEach-Object {
    if (-not $index.ContainsKey($slug)) { $index[$slug] = 0 }
    $index[$slug]++
    $n = '{0:d2}' -f $index[$slug]
    $out = Join-Path $Dst ("{0}-{1}.jpg" -f $slug, $n)

    try {
      $img = [System.Drawing.Image]::FromFile($_.FullName)
      $w = $img.Width; $h = $img.Height
      $scale = [Math]::Min(1.0, [Math]::Min($maxDim / $w, $maxDim / $h))
      $nw = [int][Math]::Round($w * $scale)
      $nh = [int][Math]::Round($h * $scale)

      $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.DrawImage($img, 0, 0, $nw, $nh)
      $g.Dispose()
      $bmp.Save($out, $encoder, $ep)
      $bmp.Dispose()
      $img.Dispose()
      $copied++
    } catch {
      Write-Warning "Failed: $($_.FullName) - $($_.Exception.Message)"
      $skipped++
    }
  }
}

# Manifest so the caption pass can reference every produced file
$manifest = Get-ChildItem -Path $Dst -File | Sort-Object Name | ForEach-Object { $_.Name }
$manifest | Set-Content -Path (Join-Path $Dst '_manifest.txt') -Encoding UTF8

Write-Output "copied=$copied skipped=$skipped"
Get-ChildItem $Dst -File | Group-Object { ($_.Name -split '-')[0..1] -join '-' } |
  ForEach-Object { "{0}: {1}" -f $_.Name, $_.Count }
$total = (Get-ChildItem $Dst -File | Measure-Object -Property Length -Sum).Sum
Write-Output ("total MB: {0:N1}" -f ($total / 1MB))
