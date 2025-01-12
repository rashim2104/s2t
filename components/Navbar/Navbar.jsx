/**
 * Navigation bar component that displays the Sairam logo and S2T logo
 * @returns {JSX.Element} Navbar component with logos
 */
import Image from "next/image"

const Navbar = () => {
  return (
    <section className="nav">
      <Image 
        src="/image/sairam_logo.svg" 
        width={150} 
        height={150} 
        alt='Sairam Institute Logo'
        priority
      />
      <div className="divider"></div>
      <Image 
        src="/image/s2t_5.0.png" 
        width={100} 
        height={100} 
        alt='Science to Technology Logo'
        priority
      />
    </section>
  )
}

export default Navbar