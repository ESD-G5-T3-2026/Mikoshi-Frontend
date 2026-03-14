import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPersonnel } from "../../../services/personnelApi";
import { showToast } from "../../../store/toast";

function CreateMeetingModal({ isOpen, onClose, onChange, onSubmit, form }) {
	const dispatch = useDispatch();
	const [showValidation, setShowValidation] = useState(false);
	const [personnelOptions, setPersonnelOptions] = useState([]);
	const [loadingPersonnel, setLoadingPersonnel] = useState(false);
	const user = useSelector((state) => state.auth.user);
	const clubId = user?.club_id;

	useEffect(() => {
		if (isOpen) {
			setLoadingPersonnel(true);
			try {
				dispatch({ type: "GET_PERSONNEL_REQUEST" });
				getPersonnel(clubId).then((data) => {
					const results = data.data;
					const filtered = results.map((item) => ({
						name: item.name,
						handle: item.telegram_handle,
					}));
					setPersonnelOptions(filtered);
					setLoadingPersonnel(false);
				});
				dispatch({ type: "GET_PERSONNEL_SUCCESS" });
			} catch {
				setLoadingPersonnel(false);
				dispatch({ type: "GET_PERSONNEL_FAILURE" });
				dispatch(showToast("Failed to create meeting.", "error"));
			}
		}
	}, [isOpen]);

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

					<label className="event-create-field">
						<span>Select Attendees</span>
						{loadingPersonnel ? (
							<div style={{ padding: "8px 0" }}>Loading attendees...</div>
						) : (
							<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
								{personnelOptions.map(({ name, handle }) => (
									<label key={name} style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 400 }}>
										<input
											type="checkbox"
											name="personnel_list"
											value={name}
											checked={form.personnel_list && form.personnel_list[name] ? true : false}
											onChange={(e) => {
												let updated = { ...(form.personnel_list || {}) };
												if (e.target.checked) {
													updated[name] = handle;
												} else {
													delete updated[name];
												}
												onChange({ target: { name: "personnel_list", value: updated } });
											}}
											style={{ width: "auto" }}
										/>
										{name}
									</label>
								))}
							</div>
						)}
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
