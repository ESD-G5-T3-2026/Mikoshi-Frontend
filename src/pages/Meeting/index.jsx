import React from "react";

function Meeting() {
	const meetings = [
		{
			title: "Upcoming Meeting",
			date: "March 20, 2026",
			location: "Clubhouse A",
			description: "Discuss upcoming events and planning."
		},
		{
			title: "Past Meeting",
			date: "February 10, 2026",
			location: "Clubhouse A",
			description: "Reviewed last month's activities."
		}
	];

	return (
		<div style={{ padding: "2rem" }}>
			<h1>Meetings</h1>
			<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
				{meetings.map((meeting, idx) => (
					<div
						key={idx}
						className="event-card"
						style={{
							width: "100%",
							background: "var(--card-bg)",
							border: "1px solid var(--border)",
							borderRadius: "12px",
							boxShadow: "var(--shadow)",
							padding: "14px",
							display: "flex",
							flexDirection: "column"
						}}
					>
						<div className="event-card-top">
							<h2>{meeting.title}</h2>
							<span className="event-datetime">{meeting.date}</span>
						</div>
						<div className="event-description">{meeting.description}</div>
						<div className="event-year">Location: {meeting.location}</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Meeting;
