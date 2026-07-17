import { NavLink } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from '../../lib/i18n/useTranslation'

export default function NavBar() {
  const { t } = useTranslation()

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/browse', label: t.nav.browse },
    { to: '/practice', label: t.nav.practice },
    { to: '/progress', label: t.nav.progress },
    { to: '/credits', label: t.nav.credits },
  ]

  return (
    <header className="border-b border-slate-200">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-4 py-3 sm:gap-4">
        <span className="font-semibold text-slate-900">{t.appName}</span>
        <ul className="flex flex-wrap gap-2 text-sm sm:gap-3">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'font-medium text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <LanguageSwitcher />
      </nav>
    </header>
  )
}
