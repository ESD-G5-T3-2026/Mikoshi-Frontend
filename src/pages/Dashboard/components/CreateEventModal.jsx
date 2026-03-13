import { useState } from 'react';

function CreateEventModal({ isOpen, form, onClose, onChange, onSubmit }) {
	const [showValidation, setShowValidation] = useState(false);

	if (!isOpen) {
		return null;
	}

	const fieldErrors = {
		event_name: !form.event_name.trim() ? 'Event name is required.' : '',
		event_type: !form.event_type.trim() ? 'Event type is required.' : '',
		event_year: !String(form.event_year).trim() ? 'Year is required.' : '',
		event_date: !String(form.event_date).trim() ? 'Date is required.' : '',
		event_desc: !form.event_desc.trim() ? 'Description is required.' : '',
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setShowValidation(true);

		if (fieldErrors.event_name || fieldErrors.event_type || fieldErrors.event_year || fieldErrors.event_date || fieldErrors.event_desc) {
			return;
		}

		onSubmit(event);
	};

	return (
		<div className="event-modal-overlay" onClick={onClose} role="presentation">
			<div className="event-modal event-create-modal" role="dialog" aria-modal="true" aria-label="Create event" onClick={(clickEvent) => clickEvent.stopPropagation()}>
				<div className="event-modal-header">
					<h2>Create Event</h2>
					<button type="button" className="event-modal-close" onClick={onClose} aria-label="Close create event form">
						×
					</button>
				</div>

				<form className="event-create-form" onSubmit={handleSubmit} noValidate>
					<label className="event-create-field">
						<span>Event Name*</span>
						<input
							type="text"
							name="event_name"
							value={form.event_name}
							onChange={onChange}
							placeholder="Enter event name"
							aria-invalid={showValidation && Boolean(fieldErrors.event_name)}
						/>
						{showValidation && fieldErrors.event_name && <span className="event-create-error">{fieldErrors.event_name}</span>}
					</label>

					<label className="event-create-field">
						<span>Event Type*</span>
						<input
							type="text"
							name="event_type"
							value={form.event_type}
							onChange={onChange}
							placeholder="Annual, Workshop, Meetup"
							aria-invalid={showValidation && Boolean(fieldErrors.event_type)}
						/>
						{showValidation && fieldErrors.event_type && <span className="event-create-error">{fieldErrors.event_type}</span>}
					</label>

					<div className="event-create-form-grid">
						<label className="event-create-field">
							<span>Year*</span>
							<input
								type="number"
								name="event_year"
								value={form.event_year}
								onChange={onChange}
								placeholder="2026"
								min="2000"
								max="2100"
								aria-invalid={showValidation && Boolean(fieldErrors.event_year)}
							/>
							{showValidation && fieldErrors.event_year && <span className="event-create-error">{fieldErrors.event_year}</span>}
						</label>

						<label className="event-create-field">
							<span>Date*</span>
							<input
								type="date"
								name="event_date"
								value={form.event_date}
								onChange={onChange}
								aria-invalid={showValidation && Boolean(fieldErrors.event_date)}
							/>
							{showValidation && fieldErrors.event_date && <span className="event-create-error">{fieldErrors.event_date}</span>}
						</label>
					</div>

					<label className="event-create-field">
						<span>Description*</span>
						<textarea
							name="event_desc"
							value={form.event_desc}
							onChange={onChange}
							placeholder="Describe the event"
							rows="4"
							aria-invalid={showValidation && Boolean(fieldErrors.event_desc)}
						/>
						{showValidation && fieldErrors.event_desc && <span className="event-create-error">{fieldErrors.event_desc}</span>}
					</label>

					<label className="event-create-field">
						<span>Remarks</span>
						<textarea name="remarks" value={form.remarks} onChange={onChange} placeholder="Add any extra notes" rows="3" />
					</label>

					<select name="event_status" value="Pending" onChange={onChange} hidden />

					<div className="event-create-actions">
						<button type="button" className="event-modal-action-btn event-modal-action-cancel" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="event-modal-action-btn event-modal-action-save">
							Save Event
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateEventModal;
