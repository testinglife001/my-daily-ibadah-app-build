import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import AssignTaskForm from "./AssignTaskForm";

// import AssignTaskForm from "../components/AssignTaskForm";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useAuth } from "../context/AuthContext";


const TaskDetails = ({user,role}) => {
  
    // const { userData } = useAuth();
    // const [user] = useAuthState(auth);
    // const [userRole, setUserRole] = useState("");
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [subtaskTitle, setSubtaskTitle] = useState("");
    // const [role, setRole] = useState('');

    const [assignedUsers, setAssignedUsers] = useState([]);
    const [newEmail, setNewEmail] = useState("");

    const [allUsers, setAllUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    // const role = user?.role;
    console.log(user)
    const currentUser = auth.currentUser;
    console.log(currentUser)

    useEffect(() => {
        const fetchUsers = async () => {
            const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
            const snapshot = await getDocs(q);
            const usersSnapshot = await getDocs(collection(db, "users"));
            const userRole = snapshot.docs.map((doc) => ({
             id: doc.id,
            // email: doc.data().email,
             role: doc.data().role
            }));
            setRole(userRole);
        };

    fetchUsers();
    }, [currentUser]);

    console.log(role);
    const uRole = currentUser?.role;
    console.log(uRole);

    /*
    const fetchTask = async () => {
        const docRef = doc(db, "tasks", taskId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        setTask({ id: docSnap.id, ...docSnap.data() });
        }
    };
    useEffect(() => {
        fetchTask();
    }, []);
    */

     // ✅ Step 1: Define fetchTaskData here
    const fetchTaskData = async () => {
        setLoading(true);
        try {
            const taskRef = doc(db, "tasks", taskId);
            const taskSnap = await getDoc(taskRef);
            if (taskSnap.exists()) {
                const taskData = { id: taskSnap.id, ...taskSnap.data() };
                setTask(taskData);

                // Fetch all users
                const usersSnap = await getDocs(collection(db, "users"));
                const all = usersSnap.docs.map((doc) => ({
                id: doc.id,
                email: doc.data().email,
                }));
                setAllUsers(all);

                // Filter available users not in team
                const team = taskData.team || [];
                const available = all.filter((user) => !team.includes(user.id));
                setAvailableUsers(available);
        }
        } catch (err) {
            console.error("Error fetching task data", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Step 2: Call it once when the component mounts
    useEffect(() => {
        fetchTaskData();
    }, []);

    

    useEffect(() => {
        const fetchUsers = async () => {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const allFetchedUsers = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            email: doc.data().email,
            }));
            setAllUsers(allFetchedUsers);

            // Filter out users already assigned to the task
            if (task?.team) {
            const available = allFetchedUsers.filter(
                (user) => !task.team.includes(user.id)
            );
            setAvailableUsers(available);
            } else {
            setAvailableUsers(allFetchedUsers);
            }
        };

    fetchUsers();
    }, [task]);


    useEffect(() => {
    const fetchTeamUsers = async () => {
        if (!task?.team?.length) return;
        const q = query(
        collection(db, "users"),
        where("__name__", "in", task.team)
        );
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            email: doc.data().email,
        }));
        setAssignedUsers(users);
    };
    fetchTeamUsers();
    }, [task]);

    const handleAddUserByEmail = async () => {
        if (!newEmail) return;
        const q = query(collection(db, "users"), where("email", "==", newEmail));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            const userId = userDoc.id;

            // Update task team
            await updateDoc(doc(db, "tasks", taskId), {
            users:  arrayUnion(userId),
            team: arrayUnion(userId),
            });

            // Update user's assignedTasks
            await updateDoc(doc(db, "users", userId), {
            assignedTasks: arrayUnion(taskId),
            });

            setNewEmail("");
            // window.location.reload(); // or re-fetch task
            await fetchTaskData();
        } else {
            alert("User not found");
        }
    };



    const handleRemoveUser = async (userId) => {
        await updateDoc(doc(db, "tasks", taskId), {
            team: arrayRemove(userId),
        });


        await updateDoc(doc(db, "users", userId), {
            assignedTasks: arrayRemove(taskId),
        });

        // window.location.reload(); // or re-fetch task
        await fetchTaskData();
    };

    const toggleSubtask = async (index) => {
        const updatedSubtasks = [...task.subtasks];
        updatedSubtasks[index].completed = !updatedSubtasks[index].completed;

        await updateDoc(doc(db, "tasks", task.id), {
            subtasks: updatedSubtasks,
        });

        // Check for completion auto stage update
        const allDone = updatedSubtasks.every((s) => s.completed);
        const newStage = allDone ? "completed" : "in-progress";
        await updateDoc(doc(db, "tasks", task.id), {
        stage: newStage,
        });

        // fetchTask();
        await fetchTaskData();
    };

    const addSubtask = async () => {
        if (subtaskTitle.trim() === "") return;
        const newSubtasks = [...(task.subtasks || []), { title: subtaskTitle, createdBy: user.uid, completed: false }];
        await updateDoc(doc(db, "tasks", task.id), {
        subtasks: newSubtasks,
        createdBy: user.uid
        });
        setSubtaskTitle("");
        // fetchTask();
        await fetchTaskData();
    };

    // ✅ Step 3: Use fetchTaskData() again after updating task

    if (loading) return <div>Loading...</div>;
    if (!task) return <div>Task not found</div>;


  return (

    <div>
        {loading ? (
        <p>Loading...</p>
        ) : !task ? (
        <p>Task not found</p>
        ) : (
        <div className="container mt-3"  style={{width:'80%', marginLeft:'10%'}} >
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p><strong>Stage:</strong> {task.stage}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            
            {/*<AssignTaskForm taskId={task.id} />*/}
            {
              //  role === 'admin' || role === 'author' ? (
              //  role === 'user'  ? (
              //      <AssignTaskForm taskId={task.id} />
              //  ) 
              //  : null
            }
                
            <h5>Assigned Users</h5>
                <ul>
                {assignedUsers.map((u) => (
                    <li key={u.id}>
                    {u.email}{" "}
                    {
                        //(userRole === "admin" || userRole === "author") && (
                       // (role === 'admin' || role === 'author') && (
                            <button onClick={() => handleRemoveUser(u.id)} className="btn btn-sm btn-danger ms-2">
                            Remove
                            </button>
                       // )
                    }
                    </li>
                ))}
                </ul>

                {
                  //  (role === 'admin' || role === 'author') && (
                <>
                    <label htmlFor="assign-user-select">Assign New User</label>
                    <select
                        
                        id="assign-user-select"
                        className="form-control my-2"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    >
                        <option value="">-- Select a user --</option>
                        {availableUsers.map((user) => (
                            <option key={user.id} value={user.email} >
                            {user.email} - {user.displayName}
                            </option>
                        ))}
                    </select>

                    <button
                    onClick={handleAddUserByEmail}
                    className="btn btn-success mb-3"
                    disabled={!newEmail}
                    >
                    Add User to Task
                    </button>
                </>
                  //  )
                }
                {/*<AssignTaskForm />*/}


            <hr />
            <h4>Subtasks</h4>
            <ul className="list-group mb-3">
                {task.subtasks?.map((subtask, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between">
                    <div>
                    <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => toggleSubtask(i)}
                        className="form-check-input me-2"
                    />
                    {subtask.title}
                    </div>
                    {subtask.completed && <span className="badge bg-success">Done</span>}
                </li>
                ))}
            </ul>

            <div className="input-group mb-3">
                <input
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                className="form-control"
                placeholder="New subtask..."
                />
                <button onClick={addSubtask} className="btn btn-primary">
                Add
                </button>
            </div>
        </div>
        )}
    </div>

    
  );
};

export default TaskDetails;
