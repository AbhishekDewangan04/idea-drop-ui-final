import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Lightbulb } from 'lucide-react'


export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="flex flex-col sm:flex-row justify-between gap-10 py-10 items-center">
        <section className="flex flex-col gap-4 flex-1">
          <Lightbulb className="text-yellow-500 w-20 h-20 hover:text-yellow-400 transition" />
          <h1 className="text-4xl font-bold text-gray-800">Welcome to IdeaDrop</h1>
          <p className="text-gray-700 max-w-xs">
            Share, explore, and build on the best startup ideas and side hustles
          </p>
        </section>

        <section className="flex-1" >
          <Outlet/>
        </section>
      </div>
}
