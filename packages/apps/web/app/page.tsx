import ShopItems from "@/app/components/product/ShopItems";

// export default function Home() {
//   return (
//       <>
//           <main className={"mx-auto"}>
//               <ShopItems />
//           </main>
//       </>
//   );
// }

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
