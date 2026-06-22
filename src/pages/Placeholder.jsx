import { Lead, SectionHeader } from "../components/primitives.jsx";

// Shared "Coming soon" page for SOON directory items.
export default function Placeholder({ item }) {
  return (
    <>
      <Lead>
        This part of the Parkway system is mapped out but not built yet — it will appear
        here as soon as it lands in the Figma library.
      </Lead>
      <SectionHeader
        label={item?.module || "Roadmap"}
        desc={`${item?.label || "This page"} is planned. In the meantime, browse what's already live from the directory on the left.`}
      />
    </>
  );
}
