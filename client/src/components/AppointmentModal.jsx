import React, { useState } from 'react';
import './AppointmentModal.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919899338813';

const AppointmentModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    parent_name: '',
    child_name: '',
    child_age: '',
    phone: '',
    email: '',
    service_id: '',
    preferred_date: '',
    preferred_time: '',
    additional_info: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
    try {
      // API call to store in DB
      const response = await fetch('http://localhost:5005/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        console.error('Failed to save appointment to DB');
      }
    } catch (err) {
      console.error('API connection failed:', err);
    }

      // Generate WhatsApp message
      const message = `NEW APPOINTMENT REQUEST

Parent/Guardian:
${formData.parent_name}

Child:
${formData.child_name}

Child Age:
${formData.child_age}

Phone:
${formData.phone}

Email:
${formData.email}

Service:
${formData.service_id || 'Not specified'}

Preferred Date:
${formData.preferred_date}

Preferred Time:
${formData.preferred_time}

Additional Information:
${formData.additional_info || 'None'}
`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      
      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        <h2 className="headline-md modal-title">Book an Appointment</h2>
        <p className="body-sm modal-subtitle">We are here to support your child's journey. Let us know how we can help.</p>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="appointment-form grid grid-cols-2">
          <div className="form-group col-span-2">
            <label className="label-sm">Parent / Guardian Name</label>
            <input type="text" name="parent_name" className="input-field" required value={formData.parent_name} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label className="label-sm">Child's Name</label>
            <input type="text" name="child_name" className="input-field" required value={formData.child_name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="label-sm">Child's Age</label>
            <input type="text" name="child_age" className="input-field" required value={formData.child_age} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="label-sm">Phone Number</label>
            <input type="tel" name="phone" className="input-field" required value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="label-sm">Email Address</label>
            <input type="email" name="email" className="input-field" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group col-span-2">
            <label className="label-sm">Therapy / Service Interested In</label>
            <select name="service_id" className="input-field" value={formData.service_id} onChange={handleChange}>
              <option value="">Select a service...</option>
              <option value="Occupational Therapy">Occupational Therapy</option>
              <option value="Speech Therapy">Speech Therapy</option>
              <option value="Behavioral Therapy">Behavioral Therapy</option>
              <option value="Physical Therapy">Physical Therapy</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label-sm">Preferred Date</label>
            <input type="date" name="preferred_date" className="input-field" required value={formData.preferred_date} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="label-sm">Preferred Time</label>
            <select name="preferred_time" className="input-field" required value={formData.preferred_time} onChange={handleChange}>
              <option value="">Select time...</option>
              <option value="Morning (8am - 12pm)">Morning (8am - 12pm)</option>
              <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
              <option value="Evening (4pm - 6pm)">Evening (4pm - 6pm)</option>
            </select>
          </div>

          <div className="form-group col-span-2">
            <label className="label-sm">Additional Information</label>
            <textarea name="additional_info" className="input-field" rows="3" value={formData.additional_info} onChange={handleChange}></textarea>
          </div>

          <div className="form-group col-span-2 submit-container">
            <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Submit Request via WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
