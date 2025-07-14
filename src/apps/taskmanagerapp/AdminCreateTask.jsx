import { useState, useEffect } from 'react';

import { collection, addDoc, getDocs, Timestamp, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';
// import { useAuth } from '../../context/AuthContext';

export default function AdminCreateTask({user}) {

    // const { currentUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'normal',
        stage: 'todo',
        dueDate: '',
        users: [],
        team: [],
        tags: ''
    });
    
    
    useEffect(() => {
        const fetchUsers = async () => {
        const snapshot = await getDocs(collection(db, 'users'));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(list);
        };
        fetchUsers();
    }, []);
    
    const [allUsers, setAllUsers] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);
    
        // Fetch all users for selection
        useEffect(() => {
            const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, "users"));
            const userList = snapshot.docs.map((doc) => ({
                id: doc.id,
                email: doc.data().email,
            }));
            setAllUsers(userList);
            };
            fetchUsers();
        }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleTeamChange = e => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const selectedIds = selectedOptions.map(opt => opt.value);
        setForm(prev => ({ ...prev, team: selectedIds }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            // const emailList = form.emails.split(',').map(email => email.trim());
            // const usersSnapshot = await getDocs(collection(db, 'users'));
            // const teamUIDs = [];
            // emailList.forEach(email => {
            // const userDoc = usersSnapshot.docs.find(doc => doc.data().email === email);
            // if (userDoc) {
            //    teamUIDs.push(userDoc.id); // id is the UID
            // }
            // });

            const q = query(
                    collection(db, "users"),
                    where("email", "in", selectedEmails)
                );
            const querySnapshot = await getDocs(q);
    
            const userIds = [];
            const userDocRefs = [];
    
            querySnapshot.forEach((docSnap) => {
                userIds.push(docSnap.id);
                userDocRefs.push(doc(db, "users", docSnap.id));
            });
        
        /*         
        const task = {
            ...form,
            tags: form.tags.split(',').map(t => t.trim()),
            createdBy: currentUser.uid,
            dueDate: Timestamp.fromDate(new Date(form.dueDate)),
            activities: [
            {
                text: 'Task created',
                createdBy: currentUser.uid,
                timestamp: Timestamp.now()
            }
            ],
            subtasks: []
        };
        */
       
            const task = {
                title: form.title,
                description: form.description,
                priority: form.priority,
                stage: form.stage,
                dueDate: Timestamp.fromDate(new Date(form.dueDate)),
                createdBy: user.uid,
                users: form.team,
                // team: teamUIDs,
                team: userIds,
                tags: form.tags.split(',').map(tag => tag.trim()),
                activities: [{
                    text: "Task created",
                    createdBy: user.uid,
                    timestamp: Timestamp.now()
                }],
                subtasks: []
            };

            const taskRef = await addDoc(collection(db, 'tasks'), task);

            setForm({ 
                title: '', 
                description: '', 
                priority: 'normal', 
                stage: 'todo', 
                dueDate: '', 
                users: [],
                team: [],
                // emails: '', 
                tags: '' 
            });

            const taskId = taskRef.id;
        
                // Update users with assigned task ID
                const updatePromises = userDocRefs.map((userRef) =>
                updateDoc(userRef, {
                    assignedTasks: arrayUnion(taskId),
                })
            );

            await Promise.all(updatePromises);
            console.log('Task created and assigned successfully!');
            alert("✅ Task created and assigned successfully");


        } catch (err) {
        console.error(err);
        alert('Failed to create task');
        }
    };

  return (
    <div>
      <h3>Create New Task</h3>
      <form onSubmit={handleSubmit} style={{width:'80%', marginLeft:'10%'}} >
        <input className="form-control mb-2" placeholder="Title" name="title" value={form.title} onChange={handleChange} required />
        <textarea className="form-control mb-2" placeholder="Description" name="description" value={form.description} onChange={handleChange} />
        <select className="form-control mb-2" name="priority" value={form.priority} onChange={handleChange}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
        <select className="form-control mb-2" name="stage" value={form.stage} onChange={handleChange}>
          <option value="todo">Todo</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <input className="form-control mb-2" type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleChange} required />
        <select multiple className="form-control mb-2" value={form.team} onChange={handleTeamChange}>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.name || u.email} ({u.role})
            </option>
          ))}
        </select>
        
        {/*<input 
            className="form-control mb-2" 
            placeholder="Assign team by email (comma separated)"
            name="emails"
            value={form.emails}
            onChange={handleChange}
        />*/}

        <label>Assign Users by Email</label>
        <select
            multiple
            className="form-control my-2"
            value={selectedEmails}
            onChange={(e) =>
            setSelectedEmails(
                Array.from(e.target.selectedOptions, (option) => option.value)
            )
            }
        >
            {allUsers.map((u) => (
            <option key={u.id} value={u.email}>
                {u.email}
            </option>
            ))}
        </select>

        <input className="form-control mb-2" placeholder="Tags (comma separated)" name="tags" value={form.tags} onChange={handleChange} />
        <button type="submit" className="btn btn-primary">Create Task</button>
      </form>
    </div>
  );
}
