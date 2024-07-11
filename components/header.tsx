export default function Header() {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-2">
            <div className="flex items-center">
                <img src="https://play-lh.googleusercontent.com/L5sDy5zFKKLLMndpR7wJfD3aum4w0FVL_rRK6W1t9T5-d4BYc-4A7LTXa2nGeP62TCo=w480-h960-rw" alt="Sleeper Fantasy Football Logo" className="h-8 w-8 mr-2 rounded-md" />
                <h1 className="font-medium text-2xl">Fantasy Football Dashboard</h1>
            </div>
            <div className="flex items-center">
                <a href="https://twitter.com/brandonmaggiano" target="_blank" rel="noreferrer">
                    <img src="https://img.shields.io/twitter/follow/brandonmaggiano?style=social" alt="Twitter" />
                </a>
            </div>
        </div>
    )
}