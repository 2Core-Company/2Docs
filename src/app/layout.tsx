import {Poiret_One, Poppins } from '@next/font/google'
import "../../styles/globals.css";
import 'react-toastify/dist/ReactToastify.min.css'
import ThemeContextProvider from '../hooks/useTheme'
import ContextUser from './Context/contextUser'
import ContextLoading from './Context/contextLoading'
import ContextCompany from './Context/contextCompany'
import ContextAdmin from './Context/contextAdmin'
import Head from './head';

const poiretOne = Poiret_One({
  display: 'auto',
  weight: ['400'],
  variable: '--font-poiretOne',
  subsets: ['latin'],
})

const poppins = Poppins({
  display: "auto",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export default function RootLayout({children,}: {children: React.ReactNode}) {
  return (
    <ThemeContextProvider>
      <html lang="pt-br" className='bg-primary dark:bg-dprimary'>
        <Head />
        <body className={`${poiretOne.variable} ${poppins.variable} text-black font-poppins font-[400] max-w-screen`}>
          <ContextAdmin>
            <ContextUser>
              <ContextLoading>
                <ContextCompany>
                  {children}
                </ContextCompany>
              </ContextLoading>
            </ContextUser>
          </ContextAdmin>
        </body>
      </html>
    </ThemeContextProvider>
  )
}
