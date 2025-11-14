import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

export default function ContactForm() {
  // Step 1: Initialize the form with your Formspree form ID
  // Replace 'xvgdzbdg' with your actual Formspree form ID from the dashboard
  const [state, handleSubmit] = useForm("xvgdzbdg");

  // Step 2: Handle form submission
  // The handleSubmit function is provided by useForm and handles the submission
  const onSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    handleSubmit(e); // Call Formspree's handleSubmit
  };

  // Step 3: Conditional rendering based on submission state
  if (state.succeeded) {
    // When state.succeeded is true, show success message
    return <p>Thanks for joining!</p>;
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Step 4: Form fields with validation */}
      {/* Name field */}
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        name="name"
        required
      />
      <ValidationError
        prefix="Name"
        field="name"
        errors={state.errors}
      />

      {/* Email field */}
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        required
      />
      <ValidationError
        prefix="Email"
        field="email"
        errors={state.errors}
      />

      {/* Subject field */}
      <label htmlFor="subject">Subject</label>
      <input
        id="subject"
        type="text"
        name="subject"
        required
      />
      <ValidationError
        prefix="Subject"
        field="subject"
        errors={state.errors}
      />

      {/* Message field */}
      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        rows={4}
        required
      />
      <ValidationError
        prefix="Message"
        field="message"
        errors={state.errors}
      />

      {/* Submit button */}
      <button type="submit" disabled={state.submitting}>
        {state.submitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}