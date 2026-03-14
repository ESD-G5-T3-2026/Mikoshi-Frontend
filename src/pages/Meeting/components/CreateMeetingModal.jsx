import { useState } from "react";

function CreateMeetingModal({ isOpen, onClose, onChange, onSubmit, form }) {
	const [showValidation, setShowValidation] = useState(false);

	if (!isOpen) {
		return null;
	}

	const fieldErrors = {
		meeting_datetime: !String(form.meeting_datetime).trim()
			? "Date and Time are required."
			: form.meeting_datetime && new Date(form.meeting_datetime) < new Date()
				? "Date and Time must be in the future."
				: "",
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setShowValidation(true);

		if (fieldErrors.meeting_datetime) {
			return;
		}

		onSubmit(event);
	};

	return (
		<div className="event-modal-overlay" onClick={onClose} role="presentation">
			<div className="event-modal event-create-modal" role="dialog" aria-modal="true" aria-label="Create event" onClick={(clickEvent) => clickEvent.stopPropagation()}>
				<div className="event-modal-header">
					<h2>Create Meeting</h2>
					<button type="button" className="event-modal-close" onClick={onClose} aria-label="Close create event form">
						×
					</button>
				</div>

				<form className="event-create-form" onSubmit={handleSubmit} noValidate>
					<label className="event-create-field">
						<span>Date & Time*</span>
						<input type="datetime-local" name="meeting_datetime" value={form.meeting_datetime} onChange={onChange} aria-invalid={showValidation && Boolean(fieldErrors.meeting_datetime)} />
						{showValidation && fieldErrors.meeting_datetime && <span className="event-create-error">{fieldErrors.meeting_datetime}</span>}
					</label>

					<div className="event-create-actions">
						<button type="button" className="event-modal-action-btn event-modal-action-cancel" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="event-modal-action-btn event-modal-action-save">
							Create
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateMeetingModal;
