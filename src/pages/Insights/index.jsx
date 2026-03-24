import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Insights.css";
import { summarizeInsights } from "../../services/insightsApi";
import { showToast } from "../../store/toast";

const SUMMARIZE_INSIGHTS_REQUEST = "insights/SUMMARIZE_INSIGHTS_REQUEST";
const SUMMARIZE_INSIGHTS_SUCCESS = "insights/SUMMARIZE_INSIGHTS_SUCCESS";
const SUMMARIZE_INSIGHTS_FAILURE = "insights/SUMMARIZE_INSIGHTS_FAILURE";

function InsightsPage() {
	const location = useLocation();
	const user = useSelector((state) => state.auth.user);
	const dispatch = useDispatch();
	const eventIds = location.state?.eventIds || [];
	const eventNames = location.state?.eventNames || [];

	const [insights, setInsights] = useState(null);

	useEffect(() => {
		if (eventIds.length > 0) {
			const fetchInsights = async () => {
				dispatch({ type: SUMMARIZE_INSIGHTS_REQUEST });
				try {
					const response = await summarizeInsights({ clubId: user?.club_id, eventIds });
					setInsights(response.data);
					dispatch({ type: SUMMARIZE_INSIGHTS_SUCCESS });
				} catch {
					dispatch({ type: SUMMARIZE_INSIGHTS_FAILURE });
					dispatch(showToast("Failed to fetch insights", "error"));
				}
			};
			fetchInsights();
		}
	}, [eventIds]);

	return (
		<div className="insights-page">
			<h2>Insights Results</h2>
			<p>
				Selected Events: |{" "}
				{eventNames.map((eventName, idx) => (
					<span key={eventName + idx}>{eventName} | </span>
				))}{" "}
			</p>
			{insights && (
				<div className="insights-summary">
					<h3>Summary Generated:</h3>
					<div className="textbox" style={{ whiteSpace: "pre-wrap", marginBottom: "1em" }}>
						{insights.summaryText}
					</div>
					<h3>Individual Details</h3>
					{insights.insights.map((insight) => (
						<div key={insight.id} className="insight-card">
							<p>
								<strong>Event Name:</strong> {eventNames[eventIds.indexOf(insight.eventId)] || insight.eventId}
							</p>
							<div className="textbox" style={{ whiteSpace: "pre-wrap", marginBottom: "0.5em" }}>
								<strong>What Happened:</strong> <p>{insight.body.whatHappened}</p>
								<strong>Why Happened:</strong> <p>{insight.body.whyHappened}</p>
								<strong>How To Improve:</strong> <p>{insight.body.howToImprove}</p>
							</div>
							<p>
								<strong>Created At:</strong> {new Date(insight.createdAt).toLocaleString()}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default InsightsPage;
