'use client'
import {Poiret_One, Poppins } from '@next/font/google'
import "../../styles/globals.css";
import Loading from '../components/Clients&Admin/Loading'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import ThemeContextProvider from '../hooks/useTheme'
import ContextUser from './Context/contextUser'
import ContextLoading from './Context/contextLoading'
import ContextCompany from './Context/contextCompany'
import ContextAdmin from './Context/contextAdmin'

const poiretOne = Poiret_One({
  display: 'auto',
  weight: ['400'],
  variable: '--font-poiretOne',
  subsets: ['latin'],
})

const poppins = Poppins({
  display: "auto",
  weight: ["400"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export default function RootLayout({children,}: {children: React.ReactNode}) {
  return (
    <ThemeContextProvider>
      <html lang="pt-br" className='bg-primary dark:bg-dprimary'>
        <title>Software para auxiliar o gerenciamento dos arquivos.</title>
        <head />
        <body className={`${poiretOne.variable} ${poppins.variable} text-white font-poppins max-w-screen`}>
          <ContextAdmin>
            <ContextUser>
              <ContextLoading>
                <ContextCompany>
                  <Loading />
                  {children}
                </ContextCompany>
              </ContextLoading>
            </ContextUser>
          </ContextAdmin>
          <ToastContainer autoClose={3000}/>
        </body>
      </html>
    </ThemeContextProvider>
  )
}
