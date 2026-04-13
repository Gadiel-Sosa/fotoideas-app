import './Header.css'

const Header = () => {
    return (
        <div className="header">
            <h1>¡Buenos días, Usuario X!</h1>
            <span>{new Date().toLocaleDateString()}</span>
        </div>
    );
}

export default Header