import Link from 'next/link';
import Image from 'next/image';
import NavDropdown from './NavBarDropdown';

export default function Header() {
  return (
    <div className='flex justify-between items-center p-3 max-w-6xl mx-auto'>
      <div>
        <Link href={'/'}>
          <Image className='rounded-full' src={'/logo.png'} alt={'logo'} width={80} height={80} />
        </Link>
      </div>
      <ul className='flex gap-4'>
        <li className='hidden sm:block'>
          <Link href={'/sign-in'}>Sign in</Link>
        </li>
        <li className='hidden sm:block'>
          <Link href={'/'}>Home</Link>
        </li>
        <li className='hidden sm:block'>    
          <Link href={'/about'}>About</Link>
        </li>
      </ul>
      <NavDropdown />
    </div>
  );
}