import { useEffect, useState } from "react";

function EventDetailsModal({ event, onClose, formatDateTime, getDurationLeft, onUpdateStatus, getInsights, onUpdateEvent }) {
	const [isEditingEvent, setIsEditingEvent] = useState(false);
	const [showValidation, setShowValidation] = useState(false);
	const [insightsData, setInsightsData] = useState(null);
	const [insightsLoading, setInsightsLoading] = useState(false);
	const [showInsights, setShowInsights] = useState(false);
	const [editForm, setEditForm] = useState({
		event_name: "",
		event_type: "",
		event_year: "",
		event_date: "",
		event_desc: "",
		remarks: "",
	});

	useEffect(() => {
		if (!event) {
			setIsEditingEvent(false);
			setShowValidation(false);
			setShowInsights(false);
			setInsightsData(null);
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
		setShowInsights(false);
		setInsightsData(null);
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

	const handleGetInsights = async () => {
		setShowInsights(true);
		setInsightsLoading(true);
		setInsightsData(null);
		// const data = await getInsights(event.id)
		const data = {
			summary: "some test summary",
			insight_list: [{ insight: "testtest", name:"Original Reflection" }],
		};
		setInsightsData(data);
		setInsightsLoading(false);
	};

	const handleBackFromInsights = () => {
		setShowInsights(false);
		setInsightsData(null);
	};

	return (
		<div className="event-modal-overlay" onClick={onClose} role="presentation">
			<div className="event-modal" role="dialog" aria-modal="true" aria-label="Event details" onClick={(e) => e.stopPropagation()}>
				{showInsights ? (
					<>
						<div className="event-modal-header">
							<div className="event-modal-header-back">
								<div type="button" className="event-modal-back" onClick={handleBackFromInsights} aria-label="Back to event details">
									← Back
								</div>
							</div>
							<button type="button" className="event-modal-close" onClick={onClose} aria-label="Close event details">
								×
							</button>
						</div>
						<h2>
							Insights — {event.name} {event.year}
						</h2>

						<div className="event-modal-content">
							{insightsLoading ? (
								<div className="event-insights-loading">
									<span className="event-insights-spinner" />
									<p>Generating insights...</p>
								</div>
							) : insightsData ? (
								<>
									<div className="event-insights-summary">
										<p>
											<strong>Summary</strong>
										</p>
										<div className="event-modal-description-box">{insightsData.summary}</div>
									</div>

									{insightsData.insight_list?.length > 0 && (
										<div className="event-insights-list">
												{insightsData.insight_list.map((insight, index) => (
													<>
														<p>
															<strong>{insight.name}</strong>
														</p>
														<div key={index} className="event-insights-item">
                                                            <div className="event-modal-description-box">{insight.insight}</div>
														</div>
													</>
												))}
										</div>
									)}
								</>
							) : (
								<p className="event-insights-error">No insights available.</p>
							)}
						</div>
					</>
				) : (
					<>
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
								<button type="button" className="event-modal-close" onClick={onClose} aria-label="Close event details">
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
										<input
											type="date"
											name="event_date"
											value={editForm.event_date}
											onChange={handleEditFormChange}
											aria-invalid={showValidation && Boolean(fieldErrors.event_date)}
										/>
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
									<button type="button" className="event-modal-action-btn event-modal-action-insights" onClick={handleGetInsights}>
										Get Insights
									</button>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default EventDetailsModal;
