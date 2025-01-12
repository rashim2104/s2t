/**
 * Footer component displaying the Sairam logo and copyright information
 * @returns {JSX.Element} Footer component
 */
import Image from "next/image"

const Footer = () => {
  return (
    <section className="foot">
      <Image 
        src="/image/sairam_logo.svg" 
        width={200} 
        height={200} 
        alt="Sairam Institute Logo"
        priority
      />
      <p>©️Sairam Institutions, {new Date().getFullYear()}. All rights Reserved.</p>
    </section>
  )
}

export default Footer