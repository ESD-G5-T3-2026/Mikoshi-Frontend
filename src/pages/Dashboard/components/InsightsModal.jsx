import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InsightsModal({ setIsInsightsModalOpen, sortedRows }) {
	const [selectedInsightEvents, setSelectedInsightEvents] = useState([]);
	const [selectedEventNames, setSelectedEventNames] = useState([]);

	const handleInsightCheckboxChange = (event) => {
		const eventKey = `${event.name} ${event.year}`;
		setSelectedInsightEvents((prev) => (prev.includes(event.id) ? prev.filter((id) => id !== event.id) : [...prev, event.id]));
		setSelectedEventNames((prev) => (prev.includes(eventKey) ? prev.filter((key) => key !== eventKey) : [...prev, eventKey]));
	};

	const navigate = useNavigate();

	const submitInsight = () => {
		navigate("/insights", { state: { eventIds: selectedInsightEvents, eventNames: selectedEventNames } });
	};

	return (
		<div className="event-modal-overlay" onClick={() => setIsInsightsModalOpen(false)}>
			<div className="event-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
				<div className="event-modal-header">
					<h2>Select Events</h2>
					<button className="event-modal-close" onClick={() => setIsInsightsModalOpen(false)} aria-label="Close">
						×
					</button>
				</div>
				<div className="event-modal-content" style={{ maxHeight: "350px", overflowY: "auto" }}>
					{sortedRows.map((row) => (
						<label
							key={row.id}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "10px",
								padding: "6px 0",
								borderBottom: "1px solid #eee",
								cursor: "pointer",
							}}>
							<input type="checkbox" checked={selectedInsightEvents.includes(row.id)} onChange={() => handleInsightCheckboxChange(row)} />
							<span>
								<strong>{row.name}</strong> ({row.year}) <br />
								<small>{row.datetime}</small>
							</span>
						</label>
					))}
				</div>
				<div className="event-modal-actions">
					<button type="button" className="event-modal-action-btn" onClick={() => submitInsight()} disabled={selectedInsightEvents.length === 0}>
						Get Insight
					</button>
				</div>
			</div>
		</div>
	);
}

export default InsightsModal;
