import {Poiret_One, Poppins } from '@next/font/google'
import "../../styles/globals.css";
import Loading from '../components/Clients&Admin/Loading'
import 'react-toastify/dist/ReactToastify.min.css'
import ThemeContextProvider from '../hooks/useTheme'
import ContextUser from './Context/contextUser'
import ContextLoading from './Context/contextLoading'
import ContextCompany from './Context/contextCompany'

const poiretOne = Poiret_One({
  display: 'swap',
  weight: ['400'],
  variable: '--font-poiretOne',
  subsets: ['latin'],
})

const poppins = Poppins({
  display: "swap",
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
          <ContextUser>
            <ContextLoading>
              <ContextCompany>
                <Loading />
                {children}
              </ContextCompany>
            </ContextLoading>
          </ContextUser>
        </body>
      </html>
    </ThemeContextProvider>
  )
}
