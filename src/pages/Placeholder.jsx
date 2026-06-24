import { Lead, SectionHeader } from "../components/primitives.jsx";

// Shared "Coming soon" page for SOON directory items.
export default function Placeholder({ item }) {
  return (
    <>
      <Lead>Mapped out, not built yet — it'll appear here once it lands in Figma.</Lead>
      <SectionHeader
        label={item?.module || "Roadmap"}
        desc={`${item?.label || "This page"} is planned. In the meantime, browse what's already live from the directory on the left.`}
      />
    </>
  );
}
