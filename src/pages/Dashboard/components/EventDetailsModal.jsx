import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../store/toast";
import { getInsights, addInsights, updateInsights } from "../../../services/insightsApi";
import InsightsForm from "./InsightsForm";
import { getPersonnel } from "../../../services/personnelApi";
import { getPersonnelAssignment, addPersonnelAssignment, deletePersonnelAssignment } from "../../../services/personnelAssignmentApi";
import { GET_PERSONNEL_FAILURE, GET_PERSONNEL_REQUEST, GET_PERSONNEL_SUCCESS } from "../../Personnel/index";

const GET_INSIGHT_REQUEST = "insights/GET_INSIGHT_REQUEST";
const GET_INSIGHT_SUCCESS = "insights/GET_INSIGHT_SUCCESS";
const GET_INSIGHT_FAILURE = "insights/GET_INSIGHT_FAILURE";
const CREATE_INSIGHT_REQUEST = "insights/CREATE_INSIGHT_REQUEST";
const CREATE_INSIGHT_SUCCESS = "insights/CREATE_INSIGHT_SUCCESS";
const CREATE_INSIGHT_FAILURE = "insights/CREATE_INSIGHT_FAILURE";
const UPDATE_INSIGHT_REQUEST = "insights/UPDATE_INSIGHT_REQUEST";
const UPDATE_INSIGHT_SUCCESS = "insights/UPDATE_INSIGHT_SUCCESS";
const UPDATE_INSIGHT_FAILURE = "insights/UPDATE_INSIGHT_FAILURE";

const CREATE_ASSIGNMENT_REQUEST = "assignments/CREATE_ASSIGNMENT_REQUEST";
const CREATE_ASSIGNMENT_SUCCESS = "assignments/CREATE_ASSIGNMENT_SUCCESS";
const CREATE_ASSIGNMENT_FAILURE = "assignments/CREATE_ASSIGNMENT_FAILURE";
const DELETE_ASSIGNMENT_REQUEST = "assignments/DELETE_ASSIGNMENT_REQUEST";
const DELETE_ASSIGNMENT_SUCCESS = "assignments/DELETE_ASSIGNMENT_SUCCESS";
const DELETE_ASSIGNMENT_FAILURE = "assignments/DELETE_ASSIGNMENT_FAILURE";

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
	const [showInsightFormDisabled, setShowInsightFormDisabled] = useState(false);
	const [insightId, setInsightId] = useState("");
	const [insightForm, setInsightForm] = useState({
		whatHappened: "",
		whyHappened: "",
		howToImprove: "",
	});

	const [showPersonnelForm, setShowPersonnalForm] = useState(false);
	const [personnel, setPersonnel] = useState([]);
	const [personnelFormData, setPersonnelFormData] = useState([]);
	const [personnelForms, setPersonnelForms] = useState([{ personnel_id: null, job: "", start_time: "", end_time: "" }]);

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

	const handleOpenAssignmentForm = async () => {
		try {
			dispatch({ type: GET_PERSONNEL_REQUEST });
			const personnel = await getPersonnel(user.club_id);
			const personnelAssignment = await getPersonnelAssignment(event.id);
			dispatch({ type: GET_PERSONNEL_SUCCESS });
			if (personnel.data.length > 0) {
				setPersonnel(personnel.data);
			}
			if (personnelAssignment.count > 0) {
				setPersonnelFormData(personnelAssignment.data.sort((a, b) => a.personnel_id - b.personnel_id));
			}
			let defaultDateTime = "";
			if (event.datetime) {
				defaultDateTime = event.datetime.replace(" ", "T").slice(0, 16);
			}

			setPersonnelForms([{
				personnel_id: null,
				job: "",
				start_time: defaultDateTime,
				end_time: defaultDateTime,
			}]);
			setShowPersonnalForm(true);
		} catch {
			dispatch({ type: GET_PERSONNEL_FAILURE });
			dispatch(showToast("Failed to retrieve personnel and assignments. Reload and try again", "error"));
		}
	};

	const handlePersonnelFormChange = (idx, e) => {
		const { name, value } = e.target;
		setPersonnelForms((forms) => forms.map((form, i) => (i === idx ? { ...form, [name]: name === "personnel_id" ? Number(value) : value } : form)));
	};

	const addPersonnelFormRow = () => {
		let defaultDateTime = "";

		if (event.datetime) {
				defaultDateTime = event.datetime.replace(" ", "T").slice(0, 16);
			}
		setPersonnelForms((forms) => [...forms, { personnel_id: null, job: "", start_time: defaultDateTime, end_time: defaultDateTime }]);
	};

	const removePersonnelFormRow = (idx) => {
		setPersonnelForms((forms) => forms.filter((_, i) => i !== idx));
	};

	const handlePersonnelAssignmentSubmit = async () => {
		const toApiFormat = (dt) => (dt ? dt + ":00+08:00" : "");
		const payload = {
			event_id: event.id,
			event_name: event.name,
			assignments: personnelForms.map((form) => ({
				...form,
				start_time: toApiFormat(form.start_time),
				end_time: toApiFormat(form.end_time),
			})),
		};
		try {
			dispatch({ type: CREATE_ASSIGNMENT_REQUEST });
			await addPersonnelAssignment(payload);
			setShowPersonnalForm(false);
			setPersonnelForms([
				{
					personnel_id: null,
					event_id: null,
					job: "",
					start_time: "",
					end_time: "",
				},
			]);
			dispatch({ type: CREATE_ASSIGNMENT_SUCCESS });
			dispatch(showToast("Assignment created successfully.", "success"));
			onClose();
		} catch {
			dispatch({ type: CREATE_ASSIGNMENT_FAILURE });
			dispatch(showToast("Assignment creation failed.", "error"));
		}
	};

	const handlePersonnelAssignmentDelete = async (assignmentId) => {
		try {
			dispatch({ type: DELETE_ASSIGNMENT_REQUEST });
			await deletePersonnelAssignment(assignmentId);
			setShowPersonnalForm(false);
			setPersonnelForms([
				{
					personnel_id: null,
					event_id: null,
					job: "",
					start_time: "",
					end_time: "",
				},
			]);
			dispatch({ type: DELETE_ASSIGNMENT_SUCCESS });
			dispatch(showToast("Assignment deleted successfully.", "success"));
			// onClose();
		} catch {
			dispatch({ type: DELETE_ASSIGNMENT_FAILURE });
			dispatch(showToast("Assignment deletion failed.", "error"));
		}
	};

	const handlePersonnelAssignmentCancel = (e) => {
		e.preventDefault();
		setShowPersonnalForm(false);
		setPersonnelForms([
			{
				personnel_id: null,
				event_id: null,
				job: "",
				start_time: "",
				end_time: "",
			},
		]);
	};

	const handleOpenInsightForm = async () => {
		try {
			dispatch({ type: GET_INSIGHT_REQUEST });
			const res = await getInsights(user.club_id, event.id);
			dispatch({ type: GET_INSIGHT_SUCCESS });
			if (res.length > 0) {
				setShowInsightFormDisabled(true);
				setInsightForm(res[0].body);
				setInsightId(res[0].id);
			} else {
				setShowInsightForm(true);
			}
		} catch {
			dispatch({ type: GET_INSIGHT_FAILURE });
			dispatch(showToast("Failed to retrieve insights. Reload and try again", "error"));
		}
	};

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
		setShowPersonnalForm(false);
		onClose();
		setPersonnelForms([{
			personnel_id: null,
			event_id: null,
			job: "",
			start_time: "",
			end_time: "",
		}]);
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
							{event.status === "Active" && !showPersonnelForm && (
								<>
									<button type="button" className="event-modal-action-btn event-modal-action-active" onClick={handleOpenAssignmentForm}>
										Assign Personnel
									</button>
									<button type="button" className="event-modal-action-btn event-modal-action-complete" onClick={() => onUpdateStatus(event.id, "Completed")}>
										Complete
									</button>
								</>
							)}
							{event.status === "Completed" && !showInsightForm && (
								<button type="button" className="event-modal-action-btn event-modal-action-complete" onClick={handleOpenInsightForm}>
									Add Insight
								</button>
							)}
						</div>
						<InsightsForm
							show={showInsightForm || showInsightFormDisabled}
							activeForm={showInsightForm}
							insightForm={insightForm}
							handleInsightUpdate={handleInsightUpdate}
							handleInsightCancel={handleInsightCancel}
							handleInsightSubmit={handleInsightSubmit}
							handleInsightFormChange={handleInsightFormChange}
						/>
						{showPersonnelForm && (
							<>
								<table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
									<thead>
										<tr>
											<th>Assigned</th>
											<th>Job</th>
											<th>Start Time</th>
											<th>End Time</th>
											<th className="cancel-pointer" onClick={handlePersonnelAssignmentCancel}>
												Cancel
											</th>
										</tr>
									</thead>
									<tbody>
										{personnelFormData.map((assignment) => {
											const person = personnel.find((p) => p.id === assignment.personnel_id);
											return (
												<tr key={assignment.id}>
													<td>{person ? person.name : assignment.personnel_id}</td>
													<td>{assignment.job}</td>
													<td>{formatDateTime(assignment.start_time.replace("T", " ").slice(0, 16))}</td>
													<td>{formatDateTime(assignment.end_time.replace("T", " ").slice(0, 16))}</td>
													<td>
														<button className="table-btn-delete" onClick={() => handlePersonnelAssignmentDelete(assignment.id)}>
															Remove
														</button>
													</td>
												</tr>
											);
										})}
										{personnelForms.map((form, idx) => (
											<tr key={idx}>
												<td>
													<select name="personnel_id" className="table-field-select" value={form.personnel_id || ""} onChange={(e) => handlePersonnelFormChange(idx, e)}>
														{personnel.map((p) => (
															<option key={p.id} value={p.id}>
																{p.name}
															</option>
														))}
													</select>
												</td>
												<td>
													<input type="text" name="job" className="table-field-input" placeholder="Job" value={form.job || ""} onChange={(e) => handlePersonnelFormChange(idx, e)} />
												</td>
												<td>
													<input
														type="datetime-local"
														name="start_time"
														className="table-field-input" 
														placeholder="Start Time"
														value={form.start_time || ""}
														onChange={(e) => handlePersonnelFormChange(idx, e)}
													/>
												</td>
												<td>
													<input
														type="datetime-local"
														name="end_time"
														className="table-field-input" 
														placeholder="End Time"
														value={form.end_time || ""}
														onChange={(e) => handlePersonnelFormChange(idx, e)}
													/>
												</td>
												<td>
													<button type="button" className="table-btn-warning" onClick={() => removePersonnelFormRow(idx)}>
														Undo
													</button>
												</td>
											</tr>
										))}
										<tr>
											<td colSpan={4}>
												<button type="button" className="table-btn-warning" onClick={addPersonnelFormRow}>
													Add Row
												</button>
											</td>
											<td >
												<button type="button" className="table-btn-success" onClick={handlePersonnelAssignmentSubmit}>
													Submit
												</button>
											</td>
										</tr>
									</tbody>
								</table>
								<form className="personnel-assignment-form"></form>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default EventDetailsModal;
