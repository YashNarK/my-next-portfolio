import { useRouter } from "next/navigation";
import { useAppDispatch } from "./useReduxCustom";
import { setNavigating } from "@/redux/features/navigationSlice";

/**
 * Wraps Next.js router.push so the NavigationLoader backdrop
 * is shown for programmatic navigations (not just <Link> clicks).
 */
export function useNavigateWithLoader() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const navigate = (href: string) => {
    dispatch(setNavigating(true));
    router.push(href);
  };

  return navigate;
}
