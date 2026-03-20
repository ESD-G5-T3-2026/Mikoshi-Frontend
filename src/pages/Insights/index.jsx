import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Insights.css";

function InsightsPage() {
	const location = useLocation();
	const eventIds = location.state?.eventIds || [];
	const eventNames = location.state?.eventNames || [];

	const [insights, setInsights] = useState(null);

	useEffect(() => {
		if (eventIds.length > 0) {
			// getInsightsForEvents(eventIds).then(setInsights);
		}
	}, [eventIds]);

	return (
		<div className="insights-page">
			<h2>Insights Results</h2>
			<p>
				Selected Events:{" "}
				{eventNames.map((eventName) => (
					<>{eventName} </>
				))}{" "}
			</p>
			{/* Render insights here */}
		</div>
	);
}

export default InsightsPage;
