import { NAVIGATION_DEMO_2 } from "../../data/navigation";
import NavigationItem from "./NavigationItem";

function Navigation() {
  return (
    <ul className="nc-Navigation flex items-center">
      {NAVIGATION_DEMO_2.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
