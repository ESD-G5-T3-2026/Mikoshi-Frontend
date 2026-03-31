function InsightsForm({ show, activeForm, insightForm, handleInsightUpdate, handleInsightCancel, handleInsightSubmit, handleInsightFormChange }) {
	if (!show) return;
	return (
		<form className="insight-form" onSubmit={handleInsightSubmit} style={{ marginTop: "1em" }}>
			{!activeForm ? <h2>Past Remarks</h2> : <h2>Add Remarks:</h2>}
			<div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
				<div>
					<label htmlFor="whatHappened" className="event-create-field">
						What Happened
						<input type="text" id="whatHappened" name="whatHappened" value={insightForm.whatHappened} onChange={handleInsightFormChange} required style={{ width: "100%" }} />
					</label>
				</div>
				<div>
					<label htmlFor="whyHappened" className="event-create-field">
						Why It Happened
						<input type="text" id="whyHappened" name="whyHappened" value={insightForm.whyHappened} onChange={handleInsightFormChange} required style={{ width: "100%" }} />
					</label>
				</div>
				<div>
					<label htmlFor="howToImprove" className="event-create-field">
						How To Improve
						<input type="text" id="howToImprove" name="howToImprove" value={insightForm.howToImprove} onChange={handleInsightFormChange} required style={{ width: "100%" }} />
					</label>
				</div>
			</div>
			<div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5em", marginTop: "1em" }}>
				<button
					type="submit"
					className="event-modal-action-btn event-modal-action-save"
					onClick={activeForm ? handleInsightSubmit : handleInsightUpdate}
					disabled={!insightForm.howToImprove || !insightForm.whatHappened || !insightForm.whyHappened}>
					Submit
				</button>
				<button type="button" className="event-modal-action-btn event-modal-action-cancel" onClick={handleInsightCancel}>
					Cancel
				</button>
			</div>
		</form>
	);
}
export default InsightsForm;