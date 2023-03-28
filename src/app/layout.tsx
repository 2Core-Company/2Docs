'use client'
import {Poiret_One, Poppins } from '@next/font/google'
import "../../styles/globals.css";
import Loading from '../components/Clients&Admin/Loading'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import ThemeContextProvider from '../hooks/useTheme'
import ContextUser from './contextUser'
import ContextLoading from './contextLoading'

const poiretOne = Poiret_One({
  display: 'swap',
  weight: ['400'],
  variable: '--font-poiretOne',
})

const poppins = Poppins({
  display: 'swap',
  weight: ['400'],
  variable: '--font-poppins',
})

export default function RootLayout({children,}: {children: React.ReactNode}) {
  return (
    <ThemeContextProvider>
      <html lang="pt-br" className='bg-primary dark:bg-dprimary'>
        <title>Software para auxiliar o gerenciamento dos arquivos.</title>
        <head />
        <body className={`${poiretOne.variable} ${poppins.variable} text-white font-poppins max-w-screen`}>
          <ContextUser>
            <ContextLoading>
              <Loading />
              {children}
            </ContextLoading>
          </ContextUser>
          <ToastContainer autoClose={3000}/>
        </body>
      </html>
    </ThemeContextProvider>
  )
}
