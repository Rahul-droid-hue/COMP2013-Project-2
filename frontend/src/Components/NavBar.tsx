import logo from "../assets/images/logo.png";

function NavBar() {
  return (
    <nav>
      <img src={logo} alt="Thrift Happens Logo" width="100" />

      <a href="#mycart">My Cart</a>
    </nav>
  );
}

export default NavBar;
