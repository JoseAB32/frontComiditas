import { Helmet } from "react-helmet-async";
import placeholderFood from "../assets/placeholder-food.svg";

interface SeoProps {
  title: string;
  description: string;
  image?: string;
}

const defaultImage = placeholderFood;

export default function Seo({ title, description, image = defaultImage }: SeoProps) {
  const fullTitle = `${title} | Comiditas Jose`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
    </Helmet>
  );
}
