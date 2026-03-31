import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Personnel.css";
import { getPersonnel, addPersonnel, removePersonnel } from "../../services/personnelApi";
import { showToast } from "../../store/toast";

const GET_PERSONNEL_REQUEST = "personnel/GET_PERSONNEL_REQUEST";
const GET_PERSONNEL_SUCCESS = "personnel/GET_PERSONNEL_SUCCESS";
const GET_PERSONNEL_FAILURE = "personnel/GET_PERSONNEL_FAILURE";
const CREATE_PERSONNEL_REQUEST = "personnel/CREATE_PERSONNEL_REQUEST";
const CREATE_PERSONNEL_SUCCESS = "personnel/CREATE_PERSONNEL_SUCCESS";
const CREATE_PERSONNEL_FAILURE = "personnel/CREATE_PERSONNEL_FAILURE";
const DELETE_PERSONNEL_REQUEST = "personnel/DELETE_PERSONNEL_REQUEST";
const DELETE_PERSONNEL_SUCCESS = "personnel/DELETE_PERSONNEL_SUCCESS";
const DELETE_PERSONNEL_FAILURE = "personnel/DELETE_PERSONNEL_FAILURE";

function PersonnelDashboard() {
	const dispatch = useDispatch();
	const [personnel, setPersonnel] = useState([]);
	const user = useSelector((state) => state.auth.user);

	const [newMatricNo, setNewMatricNo] = useState(0);
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newTeleHandle, setNewTeleHandle] = useState("");

	useEffect(() => {
		if (!user?.club_id) return;
		dispatch({ type: GET_PERSONNEL_REQUEST });
		getPersonnel(user.club_id)
			.then((response) => {
				setPersonnel(response.data);
				dispatch({ type: GET_PERSONNEL_SUCCESS });
			})
			.catch((_) => {
				dispatch({ type: GET_PERSONNEL_FAILURE });
			});
	}, [user?.club_id, dispatch]);

	const handleAdd = async () => {
		if (!newName || !newMatricNo || !newTeleHandle || !newEmail ){
			return
		}else if (newTeleHandle.includes("@")){
			dispatch(showToast("Tele Handle does not need '@'", "error"));
			return
		}else if (newMatricNo.length != 7){
			dispatch(showToast("Matric Number Invalid", "error"));
			return
		}
		else if (!newEmail.includes("@")){
			dispatch(showToast("Not valid email", "error"));
			return
		};
		const payload = {
			name: newName,
			matriculation_number: newMatricNo,
			email: newEmail,
			telegram_handle: newTeleHandle,
		};

		try {
			dispatch({ type: CREATE_PERSONNEL_REQUEST });

			await addPersonnel(user?.club_id, payload);

			setPersonnel([
				...personnel,
				{
					...payload,
					club_id: user?.club_id,
				},
			]);
			setNewName("");
			setNewMatricNo(0);
			setNewEmail("");
			setNewTeleHandle("");
			dispatch({ type: CREATE_PERSONNEL_SUCCESS });
			dispatch(showToast(`Personnel added successfully`, "success"));
		} catch {
			dispatch({ type: CREATE_PERSONNEL_FAILURE });
			dispatch(showToast(`Personnel not added. Try again later`, "error"));
			setNewName("");
			setNewMatricNo(0);
			setNewEmail("");
			setNewTeleHandle("");
            
		}
	};

	const handleRemove = async (id) => {
        try {
			dispatch({ type: DELETE_PERSONNEL_REQUEST });

			await removePersonnel(user?.club_id, {id: id});

			setPersonnel(personnel.filter((p) => p.id !== id));
			dispatch({ type: DELETE_PERSONNEL_SUCCESS });
			dispatch(showToast(`Personnel removed successfully`, "success"));
		} catch {
			dispatch({ type: DELETE_PERSONNEL_FAILURE });
			dispatch(showToast(`Personnel not removed. Try again later`, "error"));
		}
	};

	return (
		<div>
			<h2>Personnel List</h2>
			<table style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr>
						<th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Matriculation No.</th>
						<th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Name</th>
						<th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Email</th>
						<th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Tele Handle</th>
						<th style={{ borderBottom: "1px solid #ccc" }}>Actions</th>
					</tr>
				</thead>

				<tbody>
					{personnel.length === 0 ? (
						<tr>
							<td colSpan="5"> No personnel found</td>
						</tr>
					) : (
						personnel.map((person) => (
							<tr key={person.id}>
								<td>****{person.matriculation_number.toString().padStart(7, "0").slice(4)}</td>
								<td>{person.name}</td>
								<td>{person.email}</td>
								<td>@{person.telegram_handle}</td>
								<td>
									<button className="personnel-btn remove" onClick={() => handleRemove(person.id)}>
										Remove
									</button>
								</td>
							</tr>
						))
					)}

					<tr>
						<td>
							<input type="number" placeholder="Matriculation Number" value={newMatricNo} onChange={(e) => setNewMatricNo(e.target.value)} />
						</td>
						<td>
							<input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
						</td>
						<td>
							<input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
						</td>
						<td>
							<input type="text" placeholder="TeleHandle (No @)" value={newTeleHandle} onChange={(e) => setNewTeleHandle(e.target.value)} />
						</td>
						<td>
							<button className="personnel-btn" onClick={handleAdd} disabled={!newName || !newMatricNo || !newTeleHandle || !newEmail}>
								Add Personnel
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default PersonnelDashboard;
