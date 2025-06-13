import "./App.css";
import VideoManagement from "./components/VideoManagement";

function App() {
    return (
        <main>
            <header className="App">
                <h1>Greensupia 관리자</h1>
            </header>
            <section>
                <VideoManagement />
            </section>
        </main>
    );
}

export default App;
