import { execSync } from "child_process";
try {
  console.log(execSync("git log -p src/components/Testimonials.tsx").toString());
} catch (e) {
  console.log(e.message);
}
