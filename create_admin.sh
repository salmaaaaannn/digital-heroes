#!/bin/bash
for route in users subscriptions scores charities winners analytics settings; do
cat << INNER_EOF > src/app/admin/$route/page.tsx
export default function Admin${route^}Page() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col relative">
      <h1 className="text-3xl font-extrabold mb-8 z-10 capitalize">${route} Management</h1>
      <div className="glass p-8 rounded-3xl z-10 border-zinc-800">
        <p className="text-zinc-400">Manage ${route} data here.</p>
      </div>
    </div>
  );
}
INNER_EOF
done
