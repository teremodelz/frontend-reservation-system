import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { isLoggedIn, getUser, removeItem } from "@/api/tokenService"


export function NavigationBarFull() {
  const navigate = useNavigate()
  const logged = isLoggedIn()
  return (
    <nav className="w-full bg-zinc-900 px-6 py-3 flex items-center justify-between">

     
      <div className="flex items-center gap-2">
        <span
          className="text-white font-bold text-lg mr-4 cursor-pointer"
          onClick={() => navigate('/')}
        >
          TutoringApp
        </span>

        <NavigationMenu>
          <NavigationMenuList>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-white hover:bg-zinc-700 bg-transparent`}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
                Strona główna
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:bg-zinc-700 bg-transparent">
                Poznajmy się
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-96">
                  <ListItem onClick={() => navigate('/about')} title="O nas">
                    Tu będzie href i strona przekierowująca do wprowadzenia
                  </ListItem>
                  <ListItem onClick={() => navigate('/subjects')} title="Przedmioty">
                    Krótka podstrona o przedmiotach które są na stronie + przekierowanie.
                  </ListItem>
                  <ListItem onClick={() => navigate('/become-tutor')} title="Zostań korepetytorem">
                    Podoba sytuacja zostań korepetytorem ectera…
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-white hover:bg-zinc-700 bg-transparent`}
                onClick={() => navigate('/tutors')}
                style={{ cursor: 'pointer' }}
              >
                Szukaj korepetytora
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>

        {logged ? <Authorized /> : <NotAuthorized />}


    </nav>
  )
}

function ListItem({
  title,
  children,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { onClick: () => void }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
          <div className="flex flex-col gap-1 text-sm p-3">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </div>
      </NavigationMenuLink>
    </li>
  )
}

function NotAuthorized(){
  const navigate = useNavigate()
  return <div className="flex items-center gap-2">
        <NavigationMenu>
          <NavigationMenuList>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-white hover:bg-zinc-700 bg-transparent`}
                onClick={() => navigate('/login')}
                style={{ cursor: 'pointer' }}
              >
                Zaloguj się
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-white hover:bg-zinc-700 bg-transparent`}
                onClick={() => navigate('/register')}
                style={{ cursor: 'pointer' }}
              >
                Zarejestruj się
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>
}


function Authorized(){
  const navigate = useNavigate()
  const user = getUser()
  return <div className="flex items-center gap-2">
        <NavigationMenu>
          <NavigationMenuList>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-white hover:bg-zinc-900 bg-transparent`}
                style={{ cursor: 'pointer' }}
              >
                Witaj, {user?.name}
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-white hover:hover:bg-red-500 bg-transparent`}
                onClick={() => {
                  removeItem()
                  navigate('/logout')}}
                style={{ cursor: 'pointer' }}
              >
                Wyloguj się
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>
}