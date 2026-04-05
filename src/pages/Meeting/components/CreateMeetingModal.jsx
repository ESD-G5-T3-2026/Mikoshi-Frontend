import { useState } from "react";

function CreateMeetingModal({ isOpen, onClose, onChange, onSubmit, form, personnelOptions, setPersonnelOptions }) {
	const [showValidation, setShowValidation] = useState(false);

	if (!isOpen) {
		return null;
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		setShowValidation(true);

		if (!canSubmit) return;

		onSubmit(event);
	};

	const handleChange = (event)=>{
		// setShowValidation(true);
		 onChange(event);
	}

	const today = new Date();
	const isDateValid = form.meeting_dates.every((dateStr) => {
		if (!dateStr) return false;
		const date = new Date(dateStr);
		// Set time to 00:00:00 for comparison
		date.setHours(0, 0, 0, 0);
		today.setHours(0, 0, 0, 0);
		return date >= today;
	});

	const isTimeValid = form.meeting_start && form.meeting_end && form.meeting_start.length === 4 && form.meeting_end.length === 4 && Number(form.meeting_start) < Number(form.meeting_end);

	const isPersonnelValid = Object.keys(form.personnel_list).length > 0;

	const canSubmit = isDateValid && isTimeValid && isPersonnelValid;

	let dateError = "";
	if (showValidation && (!form.meeting_dates || !form.meeting_dates.filter(Boolean).length)) {
		dateError = "At least one date is required.";
	} else if (showValidation && !isDateValid) {
		dateError = "All dates must be today or in the future.";
	}

	let timeError = "";
	if (showValidation && (!form.meeting_start || !form.meeting_end)) {
		timeError = "Start and end time are required.";
	} else if (showValidation && form.meeting_start.length === 4 && form.meeting_end.length === 4 && Number(form.meeting_start) >= Number(form.meeting_end)) {
		timeError = "Start time must be before end time.";
	}

	let personnelError = "";
	if (showValidation && Object.keys(form.personnel_list).length === 0) {
		personnelError = "Select at least one attendee.";
	}

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
						<span>Meeting Name</span>
						<input type="text" name="meeting_name" value={form.meeting_name} onChange={handleChange} />
					</label>

					<label className="event-create-field">
						<span>Dates*</span>
						{form.meeting_dates.map((date, idx) => (
							<div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
								<input
									type="date"
									value={date}
									onChange={(e) => {
										const newDates = [...form.meeting_dates];
										newDates[idx] = e.target.value;
										handleChange({ target: { name: "meeting_dates", value: newDates } });
									}}
									required
								/>
								{form.meeting_dates.length > 1 && (
									<button
										type="button"
										className="event-modal-action-btn event-modal-action-cancel"
										onClick={() => {
											const newDates = form.meeting_dates.filter((_, i) => i !== idx);
											handleChange({ target: { name: "meeting_dates", value: newDates } });
										}}>
										Remove
									</button>
								)}
							</div>
						))}
						<button
							type="button"
							className="event-modal-action-btn"
							onClick={() => handleChange({ target: { name: "meeting_dates", value: [...form.meeting_dates, ""] } })}
							style={{ marginTop: "8px" }}>
							Add Date
						</button>
						{dateError && <span className="event-create-error">{dateError}</span>}
					</label>

					<div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
						<label className="event-create-field" style={{ flex: 1 }}>
							<span>Start of Availability</span>
							<input
								type="text"
								name="meeting_start"
								value={form.meeting_start}
								onChange={handleChange}
								pattern="^([01]\d|2[0-3])[0-5]\d$"
								placeholder="e.g. 0930"
								maxLength={4}
								required
								title="Enter time in 24-hour HHMM format (e.g., 0930, 1745)"
								inputMode="numeric"
							/>
						</label>
						<label className="event-create-field" style={{ flex: 1 }}>
							<span>End of Availability</span>
							<input
								type="text"
								name="meeting_end"
								value={form.meeting_end}
								onChange={handleChange}
								pattern="^([01]\d|2[0-3])[0-5]\d$"
								placeholder="e.g. 1745"
								maxLength={4}
								required
								title="Enter time in 24-hour HHMM format (e.g., 0930, 1745)"
								inputMode="numeric"
							/>
						</label>
					</div>
					{timeError && <span className="event-create-error">{timeError}</span>}


					<label className="event-create-field">
						<span>Select Attendees</span>

						<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
							{personnelOptions.map(({ id, name }) => (
								<label key={id} style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 400 }}>
									<input
										type="checkbox"
										name="personnel_list"
										value={name}
										checked={form.personnel_list && Object.prototype.hasOwnProperty.call(form.personnel_list, id)}
										onChange={(e) => {
											let updated = { ...(form.personnel_list || {}) };
											if (e.target.checked) {
												updated[id] = name;
											} else {
												delete updated[id];
											}
											handleChange({ target: { name: "personnel_list", value: updated } });
										}}
										style={{ width: "auto" }}
									/>
									{name}
								</label>
							))}
						</div>
						{personnelError && <span className="event-create-error">{personnelError}</span>}
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
