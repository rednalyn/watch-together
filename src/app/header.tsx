const Header = () => {
    return (<header style={headerStyle}><h1>Watch together</h1></header>)
};

const headerStyle: React.CSSProperties = {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '30px 0'
  };
export default Header;