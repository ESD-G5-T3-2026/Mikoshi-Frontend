import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMeetings, createMeeting } from "../../services/meetingApi";
import "../Dashboard/Dashboard.css";
import CreateMeetingModal from "./components/CreateMeetingModal";
import { showToast } from "../../store/toast";
import { getPersonnel } from "../../services/personnelApi";

const CREATE_MEETING_REQUEST = "meeting/CREATE_MEETING_REQUEST";
const CREATE_MEETING_SUCCESS = "meeting/CREATE_MEETING_SUCCESS";
const CREATE_MEETING_FAILURE = "meeting/CREATE_MEETING_FAILURE";

const initialCreateMeetingForm = {
	meeting_name: "",
	meeting_datetime: "",
	personnel_list: {},
	meeting_dates: [],
	meeting_end: "",
	meeting_start: "",
};

function MeetingPage() {
	const user = useSelector((state) => state.auth.user);
	const [meetings, setMeetings] = useState([]);
	const clubId = user?.club_id;
	const dispatch = useDispatch();
	const isLoading = useSelector((state) => state.loading.isLoading);
	const [personnelOptions, setPersonnelOptions] = useState([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [createMeetingForm, setCreateMeetingForm] = useState(initialCreateMeetingForm);

	const normalizeDateTime = (value) => {
		if (!value) {
			return "";
		}

		if (typeof value === "string") {
			const trimmedValue = value.trim();

			if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(trimmedValue)) {
				return trimmedValue.slice(0, 16);
			}

			if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
				return `${trimmedValue} 00:00`;
			}

			if (trimmedValue.includes("T")) {
				return trimmedValue.replace("T", " ").slice(0, 16);
			}
		}

		const parsedDate = new Date(value);
		if (Number.isNaN(parsedDate.getTime())) {
			return "";
		}

		const year = parsedDate.getFullYear();
		const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
		const day = String(parsedDate.getDate()).padStart(2, "0");
		const hour = String(parsedDate.getHours()).padStart(2, "0");
		const minute = String(parsedDate.getMinutes()).padStart(2, "0");

		return `${year}-${month}-${day} ${hour}:${minute}`;
	};
	const getDurationLeft = (rawDateTime) => {
		if (!rawDateTime) {
			return "";
		}

		const eventDate = new Date(rawDateTime.replace(" ", "T"));
		if (Number.isNaN(eventDate.getTime())) {
			return "";
		}

		const now = new Date();

		const diffMs = eventDate.getTime() - now.getTime();
		const dayMs = 1000 * 60 * 60 * 24;

		if (diffMs < 0) {
			return "";
		}
		if (diffMs < dayMs) {
			return "(today)";
		}

		const diffDays = diffMs / dayMs;

		if (diffDays < 30) {
			const days = Math.ceil(diffDays);
			return `(In ${days} day${days === 1 ? "" : "s"})`;
		}

		const months = Math.ceil(diffDays / 30);
		return `(In ${months} month${months === 1 ? "" : "s"})`;
	};

	useEffect(() => {
		async function fetchMeetings() {
			dispatch({ type: "MEETINGS_REQUEST" });

			let personnelTemp = [];
			try {
				dispatch({ type: "GET_PERSONNEL_REQUEST" });
				getPersonnel(clubId).then((data) => {
					const results = data.data;
					personnelTemp = results.map((item) => ({
						id: String(item.id),
						name: item.name,
						handle: item.telegram_handle,
					}));
					setPersonnelOptions(personnelTemp);
				});
				dispatch({ type: "GET_PERSONNEL_SUCCESS" });
			} catch {
				dispatch({ type: "GET_PERSONNEL_FAILURE" });
				dispatch(showToast("Failed to create meeting.", "error"));
			}

			try {
				const json = await getMeetings(clubId);
				if (json.status === "ok" && Array.isArray(json.data)) {
					setMeetings(
						json.data
							.map((m) => ({
								id: m.id,
								name: m.meeting_name,
								dt: new Date(m.meeting_dt).toLocaleString(),
								meeting_dt: m.meeting_dt,
								timeful_link: m.timeful_link,
								zoom_link: m.zoom_link,
								personnel_list: Object.keys(m.personnel_list || {}).map((id) => {
									const found = personnelTemp.find((p) => String(p.id) === String(id));
									return found ? found.name : id;
								}),
								status: m.status,
							}))
							.sort((a, b) => new Date(b.dt) - new Date(a.dt)),
					);
				}
				dispatch({ type: "MEETINGS_SUCCESS" });
			} catch (e) {
				dispatch({ type: "MEETINGS_FAILURE", payload: e.message });
			}
		}
		fetchMeetings();
	}, [clubId, dispatch]);

	const handleOpenMeetingModal = () => {
		setCreateMeetingForm(initialCreateMeetingForm);
		setIsCreateModalOpen(true);
	};

	const handleCloseCreateModal = () => {
		setIsCreateModalOpen(false);
	};
	const handleCreateMeetingChange = (event) => {
		const { name, value } = event.target;
		setCreateMeetingForm((previousForm) => ({
			...previousForm,
			[name]: value,
		}));
	};
	const handleCreateMeetingSubmit = async (event) => {
		event.preventDefault();

		const payload = {
			clubId: user?.club_id,
			meetingName: createMeetingForm.meeting_name,
			meetingDates: createMeetingForm.meeting_dates,
			meetingEnd: createMeetingForm.meeting_end,
			meetingStart: createMeetingForm.meeting_start,
			personnel: Object.keys(createMeetingForm.personnel_list).map(String),
			timefulType: "specific_dates",
			timezone: "Asia/Singapore",
		};
		dispatch({ type: CREATE_MEETING_REQUEST });

		try {
			setIsCreateModalOpen(false);
			const newMeeting = await createMeeting(payload);
			const mappedMeeting = {
				name: payload.meetingName,
				timeful_link: newMeeting.timefulUrl,
				personnel_list: Object.values(createMeetingForm.personnel_list),
				status: "Pending",
			};

			setMeetings((prev) => [mappedMeeting, ...prev].sort((a, b) => new Date(b.meeting_dt) - new Date(a.meeting_dt)));
			dispatch({ type: CREATE_MEETING_SUCCESS });
			dispatch(showToast("Meeting created successfully.", "success"));
			setCreateMeetingForm(initialCreateMeetingForm);
		} catch (e){
			console.log(e)
			dispatch({ type: CREATE_MEETING_FAILURE });
			dispatch(showToast("Failed to create meeting.", "error"));
		}
	};

	return (
		<main className="dashboard-page">
			<section className="dashboard-card" aria-label="Meetings">
				<div className="dashboard-header-row">
					<h1>View Meetings</h1>
					<button type="button" className="dashboard-add-button" aria-label="Add meeting" onClick={() => handleOpenMeetingModal()}>
						<span className="dashboard-add-button-icon">+</span>
					</button>
				</div>
				<div className="event-grid" style={{ gridTemplateColumns: "1fr" }} aria-label="Meeting records">
					{meetings.length === 0 && !isLoading ? (
						<div>No meetings found.</div>
					) : (
						meetings.map((meeting) => (
							<article className="event-card" key={meeting.id}>
								<div className="event-card-top">
									<h2>
										Meeting {meeting.name ? meeting.name : meeting.id}
									</h2>
									{/* <span className="event-datetime">{normalizeDateTime(meeting.dt)}</span> */}
								</div>
								<p>Status: {meeting.status}</p>
								{meeting.personnel_list && Object.values(meeting.personnel_list).length > 0 && <p>Attendees: {meeting.personnel_list.join(", ")}</p>}
								{meeting.status == "Pending" || meeting.status == "Waiting" ? (
									<div>
										<p>
											Timeful Link: <a href={meeting.timeful_link}> Click Here</a>
										</p>
										{meeting.zoom_link ? (
											<p>
												Zoom Link: <a href={meeting.zoom_link}> Click Here</a>
											</p>
										) : (
											<></>
										)}
									</div>
								) : (
									<></>
								)}
							</article>
						))
					)}
				</div>
				{isCreateModalOpen && (
					<CreateMeetingModal
						key={isCreateModalOpen ? "create-event-modal-open" : "create-event-modal-closed"}
						form={createMeetingForm}
						onClose={handleCloseCreateModal}
						onChange={handleCreateMeetingChange}
						onSubmit={handleCreateMeetingSubmit}
						isOpen={isCreateModalOpen}
						personnelOptions={personnelOptions}
						setPersonnelOptions={setPersonnelOptions}
					/>
				)}
			</section>
		</main>
	);
}

export default MeetingPage;
