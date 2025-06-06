# 3D Shape Animator

A beautiful, interactive 3D shape animator built with React, TypeScript, and Three.js. Create stunning animated geometries with customizable colors, motions, and export capabilities.

## 🌐 Live Demo

**🚀 [Try it now at: https://raphaelsr.github.io/3d-shape-animator/](https://raphaelsr.github.io/3d-shape-animator/)**

## ✨ Features

- **Interactive 3D Geometries**: Cube, Sphere, Pyramid, Cylinder, Cone, and Torus
- **Advanced Color Controls**: Preset swatches and custom color pickers with gradient mixing
- **Motion Animation**: Configurable spin speed, tilt, bounce amplitude, and orbit radius
- **Export Functionality**: High-quality MP4 and GIF exports at multiple resolutions
- **Responsive Design**: Works seamlessly from mobile (320px) to 4K displays
- **Dark/Light Themes**: Automatic UI adaptation with smooth transitions
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Real-time Controls**: All animations update immediately with 60fps performance

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/RaphaelSR/3d-shape-animator.git
cd 3d-shape-animator

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run lint:fix` | Automatically fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:ui` | Run tests with interactive UI |
| `npm run test:coverage` | Generate test coverage report |

## 🏗️ Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable UI components
│   ├── AnimatedGeometry.tsx
│   ├── ColorSelector.tsx
│   ├── ExportControls.tsx
│   ├── GeometrySelector.tsx
│   ├── MotionControls.tsx
│   ├── Scene.tsx
│   └── Sidebar.tsx
├── features/        # Feature-specific components
├── hooks/          # Custom React hooks
│   └── useAppStore.ts
├── pages/          # Page components
│   └── HomePage.tsx
├── styles/         # Global styles and themes
├── test/           # Test utilities and setup
├── utils/          # Utility functions and types
│   ├── exportUtils.ts
│   └── types.ts
└── main.tsx        # Application entry point
```

## 🎨 Usage Guide

### Basic Controls

1. **Geometry Selection**: Choose from 6 different 3D shapes in the left sidebar
2. **Color Customization**: 
   - Use preset color swatches for quick selection
   - Use the color picker for custom colors
   - Set both primary and secondary colors for gradient effects
3. **Motion Controls**: 
   - Adjust spin speed (0-3x)
   - Control tilt rotation (0-2x)  
   - Set bounce amplitude (0-1)
   - Configure orbit radius (0-3)

### Animation Controls

- **Play/Pause**: Toggle animation playback
- **Reset**: Return all motion controls to default values
- Setting all controls to zero automatically stops animation

### Export Options

Choose from three quality presets:
- **High**: MP4 at 60fps, 1080p resolution
- **Medium**: MP4 at 30fps, 720p resolution  
- **Low**: GIF at 15fps, 480p resolution

Exports capture only the 3D object, not the entire interface.

### Keyboard Accessibility

- `Tab`: Navigate between controls
- `Space/Enter`: Activate buttons and selections
- `Arrow Keys`: Adjust slider values
- `Esc`: Close modals and dropdowns

## 🧪 Testing

The project uses Vitest for unit testing with comprehensive coverage of:

- Store state management
- Component rendering
- User interactions
- Export functionality

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🔧 Development

### Code Quality

The project enforces strict TypeScript and code quality standards:

- **TypeScript**: Strict mode enabled with `noImplicitAny`
- **ESLint**: Comprehensive rules for React and TypeScript
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks

### Adding New Geometries

1. Add the geometry type to `src/utils/types.ts`
2. Update `GEOMETRY_CONFIGS` with label and icon
3. Add the geometry case in `AnimatedGeometry.tsx`
4. Update tests accordingly

### Customizing Themes

Themes are managed through Mantine's color scheme system. Modify `src/App.tsx` to add new theme variants or customize existing ones.

## 🚀 Deployment

### GitHub Pages (Automated)

The project includes a GitHub Actions workflow for automatic deployment:

1. Push to `main` branch
2. GitHub Actions runs tests and builds
3. Automatically deploys to GitHub Pages
4. Live site available at: `https://raphaelsr.github.io/3d-shape-animator`

### Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains the built application
# Upload to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Run tests and linting (`npm run test && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Contribution Guidelines

- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure all CI checks pass
- Use descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Raphael Rocha** - Full Stack Developer
- GitHub: [@RaphaelSR](https://github.com/RaphaelSR)
- Repository: [3d-shape-animator](https://github.com/RaphaelSR/3d-shape-animator)

This is an open-source project created to showcase modern web development techniques using React, TypeScript, and Three.js. Feel free to explore, learn from, and contribute to the codebase!

## 💫 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [Mantine](https://mantine.dev/) - React components library
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Vite](https://vitejs.dev/) - Build tool and development server

---

**Built with ❤️ by [Raphael Rocha](https://github.com/RaphaelSR)**  
*Open Source • React • TypeScript • Three.js*
