import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetch('/users')
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <ul>
                    {data &&
                        data.map((user) => (
                            <li key={user.id}>
                                {user.name} - {user.email}
                            </li>
                        ))}
                </ul>
            </header>
        </div>
    );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navigation from './components/Navigation';
// import UsersList from './components/UsersList';
// import TeamsList from './components/TeamsList';
// import ProjectsList from './components/ProjectsList';
// import TasksList from './components/TasksList';
// // Import other components as needed

// function App() {
//     return (
//         <Router>
//             <div>
//                 <Navigation />
//                 <Routes>
//                     <Route path="/users" component={UsersList} />
//                     <Route path="/teams" component={TeamsList} />
//                     <Route path="/projects" component={ProjectsList} />
//                     <Route path="/tasks" component={TasksList} />
//                     {/* Add other routes as needed */}
//                 </Routes>
//             </div>
//         </Router>
//     );
// }

// export default App;
