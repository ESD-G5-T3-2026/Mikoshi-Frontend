import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../store/toast";
import { getInsights, addInsights, updateInsights } from "../../../services/insightsApi";

const GET_INSIGHT_REQUEST = "insights/GET_INSIGHT_REQUEST";
const GET_INSIGHT_SUCCESS = "insights/GET_INSIGHT_SUCCESS";
const GET_INSIGHT_FAILURE = "insights/GET_INSIGHT_FAILURE";
const CREATE_INSIGHT_REQUEST = "insights/CREATE_INSIGHT_REQUEST";
const CREATE_INSIGHT_SUCCESS = "insights/CREATE_INSIGHT_SUCCESS";
const CREATE_INSIGHT_FAILURE = "insights/CREATE_INSIGHT_FAILURE";
const UPDATE_INSIGHT_REQUEST = "insights/UPDATE_INSIGHT_REQUEST";
const UPDATE_INSIGHT_SUCCESS = "insights/UPDATE_INSIGHT_SUCCESS";
const UPDATE_INSIGHT_FAILURE = "insights/UPDATE_INSIGHT_FAILURE";

function EventDetailsModal({ event, onClose, formatDateTime, getDurationLeft, onUpdateStatus, onUpdateEvent }) {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);
	const [isEditingEvent, setIsEditingEvent] = useState(false);
	const [showValidation, setShowValidation] = useState(false);
	const [editForm, setEditForm] = useState({
		event_name: "",
		event_type: "",
		event_year: "",
		event_date: "",
		event_desc: "",
		remarks: "",
	});
	const [showInsightForm, setShowInsightForm] = useState(false);
	const [showInsightFormDisabled, setShowInsightFormDisabled] = useState(false)
	const [insightId, setInsightId] = useState("")


	const [insightForm, setInsightForm] = useState({
		whatHappened: "",
		whyHappened: "",
		howToImprove: "",
	});

	useEffect(() => {
		if (!event) {
			setShowValidation(false);
			setEditForm({
				event_name: "",
				event_type: "",
				event_year: "",
				event_date: "",
				event_desc: "",
				remarks: "",
			});
			return;
		}

		setIsEditingEvent(false);
		setShowValidation(false);
		setEditForm({
			event_name: event.name || "",
			event_type: event.type || "",
			event_year: String(event.year || ""),
			event_date: event.datetime ? event.datetime.split(" ")[0] : "",
			event_desc: event.description || "",
			remarks: event.remarks || "",
		});
	}, [event]);

	if (!event) return null;

	const canShowPencil = event.status === "Pending" || event.status === "Active";
	const fieldErrors = {
		event_name: !editForm.event_name.trim() ? "Event name is required." : "",
		event_type: !editForm.event_type.trim() ? "Event type is required." : "",
		event_year: !String(editForm.event_year).trim() ? "Year is required." : "",
		event_date: !String(editForm.event_date).trim() ? "Date is required." : "",
		event_desc: !editForm.event_desc.trim() ? "Description is required." : "",
	};

	const handleEditFormChange = (changeEvent) => {
		const { name, value } = changeEvent.target;
		setEditForm((previousForm) => ({ ...previousForm, [name]: value }));
	};

	const handleSaveEvent = async (submitEvent) => {
		submitEvent.preventDefault();
		setShowValidation(true);
		if (fieldErrors.event_name || fieldErrors.event_type || fieldErrors.event_year || fieldErrors.event_date || fieldErrors.event_desc) return;
		const isUpdated = await onUpdateEvent(event.id, editForm);
		if (isUpdated) setIsEditingEvent(false);
	};

	const handleOpenInsightForm = async () => {
		try{
			dispatch({ type: GET_INSIGHT_REQUEST });
			const res = await getInsights(user.club_id, event.id);
			dispatch({ type: GET_INSIGHT_SUCCESS });
			if(res.length > 0){
				setShowInsightFormDisabled(true)
				setInsightForm(res[0].body)
				setInsightId(res[0].id)
			}else{
				setShowInsightForm(true)
			}
		}catch{
			dispatch({ type: GET_INSIGHT_FAILURE });
			dispatch(showToast("Failed to retrieve insights. Reload and try again", "error"));
		}
	}

	const handleInsightFormChange = (e) => {
		const { name, value } = e.target;
		setInsightForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleInsightSubmit = async (e) => {
		e.preventDefault();
		const payload = {
			clubId: user?.club_id,
			eventId: event.id,
			body: insightForm,
			status: "PUBLISHED",
		};
		try {
			dispatch({ type: CREATE_INSIGHT_REQUEST });
			await addInsights(payload);
			setShowInsightForm(false);
			setShowInsightFormDisabled(false);
			setInsightForm({ whatHappened: "", whyHappened: "", howToImprove: "" });
			dispatch({ type: CREATE_INSIGHT_SUCCESS });
			dispatch(showToast("Insight created successfully.", "success"));
			onClose();

		} catch {
			dispatch({ type: CREATE_INSIGHT_FAILURE });
			dispatch(showToast("Insight creation failed.", "error"));
		}
	};

	const handleInsightUpdate = async (e) => {
		e.preventDefault();
		const payload = {
			clubId: user?.club_id,
			eventId: event.id,
			body: insightForm,
			status: "PUBLISHED",
		};
		try {
			dispatch({ type: UPDATE_INSIGHT_REQUEST });
			await updateInsights(insightId, user?.club_id, payload);
			setShowInsightForm(false);
			setShowInsightFormDisabled(false);
			setInsightForm({ whatHappened: "", whyHappened: "", howToImprove: "" });
			dispatch({ type: UPDATE_INSIGHT_SUCCESS });
			dispatch(showToast("Insight updated successfully.", "success"));
			onClose();

		} catch {
			dispatch({ type: UPDATE_INSIGHT_FAILURE });
			dispatch(showToast("Insight update failed.", "error"));
		}
	};

	const handleInsightCancel = (e) => {
		e.preventDefault();
		setShowInsightForm(false);
		setShowInsightFormDisabled(false);
		setInsightForm({ whatHappened: "", whyHappened: "", howToImprove: "" });
	};

	const handleClose = () => {
    setShowInsightForm(false);
    setShowInsightFormDisabled(false);
    onClose();
};

	return (
		<div className="event-modal-overlay" onClick={handleClose} role="presentation">
			<div className="event-modal" role="dialog" aria-modal="true" aria-label="Event details" onClick={(e) => e.stopPropagation()}>
				<div className="event-modal-header">
					<h2>
						{event.name} {event.year} ({event.status})
					</h2>
					<div className="event-modal-header-actions">
						{canShowPencil && !isEditingEvent && (
							<button type="button" className="event-modal-remarks-edit-trigger" onClick={() => setIsEditingEvent(true)} aria-label="Edit event">
								✎
							</button>
						)}
						<button type="button" className="event-modal-close" onClick={handleClose} aria-label="Close event details">
							×
						</button>
					</div>
				</div>

				{isEditingEvent ? (
					<form className="event-create-form" onSubmit={handleSaveEvent} noValidate>
						<label className="event-create-field">
							<span>Event Name*</span>
							<input
								type="text"
								name="event_name"
								value={editForm.event_name}
								onChange={handleEditFormChange}
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
								value={editForm.event_type}
								onChange={handleEditFormChange}
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
									value={editForm.event_year}
									onChange={handleEditFormChange}
									placeholder="2026"
									min="2000"
									max="2100"
									aria-invalid={showValidation && Boolean(fieldErrors.event_year)}
								/>
								{showValidation && fieldErrors.event_year && <span className="event-create-error">{fieldErrors.event_year}</span>}
							</label>

							<label className="event-create-field">
								<span>Date*</span>
								<input type="date" name="event_date" value={editForm.event_date} onChange={handleEditFormChange} aria-invalid={showValidation && Boolean(fieldErrors.event_date)} />
								{showValidation && fieldErrors.event_date && <span className="event-create-error">{fieldErrors.event_date}</span>}
							</label>
						</div>

						<label className="event-create-field">
							<span>Description*</span>
							<textarea
								name="event_desc"
								value={editForm.event_desc}
								onChange={handleEditFormChange}
								placeholder="Describe the event"
								rows="4"
								aria-invalid={showValidation && Boolean(fieldErrors.event_desc)}
							/>
							{showValidation && fieldErrors.event_desc && <span className="event-create-error">{fieldErrors.event_desc}</span>}
						</label>

						<label className="event-create-field">
							<span>Remarks</span>
							<textarea name="remarks" value={editForm.remarks} onChange={handleEditFormChange} placeholder="Add any extra notes" rows="3" />
						</label>

						<div className="event-create-actions">
							<button
								type="button"
								className="event-modal-action-btn event-modal-action-cancel"
								onClick={() => {
									setIsEditingEvent(false);
									setShowValidation(false);
									setEditForm({
										event_name: event.name || "",
										event_type: event.type || "",
										event_year: String(event.year || ""),
										event_date: event.datetime ? event.datetime.split(" ")[0] : "",
										event_desc: event.description || "",
										remarks: event.remarks || "",
									});
								}}>
								Cancel
							</button>
							<button type="submit" className="event-modal-action-btn event-modal-action-save">
								Save Changes
							</button>
						</div>
					</form>
				) : (
					<div className="event-modal-content">
						<p>
							<strong>Date & Time:</strong> {formatDateTime(event.datetime)} {getDurationLeft(event.datetime) || "(Ended)"}
						</p>
						<p>
							<strong>Description:</strong>
						</p>
						<div className="event-modal-description-box">{event.description}</div>

						<div className="event-modal-remarks-header">
							<p>
								<strong>Remarks:</strong>
							</p>
						</div>
						<div className="event-modal-description-box">{event.remarks?.trim() ? event.remarks : "-"}</div>

						<div className="event-modal-actions">
							{event.status === "Pending" && (
								<>
									<button type="button" className="event-modal-action-btn event-modal-action-complete" onClick={() => onUpdateStatus(event.id, "Completed")}>
										Complete
									</button>
									<button type="button" className="event-modal-action-btn event-modal-action-active" onClick={() => onUpdateStatus(event.id, "Active")}>
										Set Active
									</button>
								</>
							)}
							{event.status === "Active" && (
								<button type="button" className="event-modal-action-btn event-modal-action-complete" onClick={() => onUpdateStatus(event.id, "Completed")}>
									Complete
								</button>
							)}
							{event.status === "Completed" && !showInsightForm && (
								<button type="button" className="event-modal-action-btn event-modal-action-complete" onClick={handleOpenInsightForm}>
									Add Insight
								</button>
							)}
						</div>
						{(showInsightForm || showInsightFormDisabled) && (
							<form className="insight-form" onSubmit={handleInsightSubmit} style={{ marginTop: "1em" }}>
								{showInsightFormDisabled ? <h2>Past Remarks</h2> : <h2>Add Remarks:</h2>}
								<div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
									<div>
										<label htmlFor="whatHappened" className="event-create-field">
											What Happened
											<input
												type="text"
												id="whatHappened"
												name="whatHappened"
												value={insightForm.whatHappened}
												onChange={handleInsightFormChange}
												required
												style={{ width: "100%" }}
											/>
										</label>
									</div>
									<div>
										<label htmlFor="whyHappened" className="event-create-field">
											Why It Happened
											<input
												type="text"
												id="whyHappened"
												name="whyHappened"
												value={insightForm.whyHappened}
												onChange={handleInsightFormChange}
												required
												style={{ width: "100%" }}
											/>
										</label>
									</div>
									<div>
										<label htmlFor="howToImprove" className="event-create-field">
											How To Improve
											<input
												type="text"
												id="howToImprove"
												name="howToImprove"
												value={insightForm.howToImprove}
												onChange={handleInsightFormChange}
												required
												style={{ width: "100%" }}
											/>
										</label>
									</div>
								</div>
								<div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5em", marginTop: "1em" }}>
									<button type="submit" className="event-modal-action-btn event-modal-action-save" onClick={!showInsightFormDisabled ? handleInsightSubmit : handleInsightUpdate} disabled={!insightForm.howToImprove || !insightForm.whatHappened || !insightForm.whyHappened}>
										Submit
									</button>
									<button type="button" className="event-modal-action-btn event-modal-action-cancel" onClick={handleInsightCancel}>
										Cancel
									</button>
								</div>
							</form>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default EventDetailsModal;
