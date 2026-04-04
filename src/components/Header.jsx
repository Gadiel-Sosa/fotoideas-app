export default function Header() {
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>¡Buenos días, Usuario X!</h1>
            <span>{new Date().toLocaleDateString()}</span>
        </div>
    );
}