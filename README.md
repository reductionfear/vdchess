<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# VDChess - Blindfold Chess Training App

A chess visualization and memory training application built with React, TypeScript, and the chessops library.

## Features

- 🎯 **Blindfold Training Mode** - Memorize and recreate chess positions
- 📝 **Board Editor** - Create custom positions with full FEN support
- 📊 **Analysis Tools** - Analyze positions and games
- 🎮 **Multiple Difficulty Levels** - Easy, Medium, and Hard training modes
- ♟️ **Standards-Compliant** - Built on the chessops library for reliable chess logic

## Chess Engine

This application uses [chessops](https://github.com/lichess-org/chessops) for all chess operations, providing:
- Legal move generation and validation
- FEN/PGN parsing and generation
- Check/checkmate/stalemate detection
- Position validation

See [src/utils/chess/README.md](src/utils/chess/README.md) for detailed documentation on the chess utilities.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
/components     - Reusable UI components (Board, Editor, etc.)
/pages         - Application pages (Home, Trainer, Analysis, etc.)
/src
  /components  - Modern components with chess integration
  /hooks       - Custom React hooks (useChessboard, etc.)
  /utils
    /chess     - Chess utilities and logic (chessops-based)
/types.ts      - TypeScript type definitions
/constants.ts  - Application constants
```

## Architecture

The application has been refactored to use a unified chess engine based on chessops:

- **Board Representation**: Custom 2D array format compatible with legacy code
- **Chess Logic**: Powered by chessops for all move generation and validation
- **State Management**: React hooks with integrated chess state
- **Type Safety**: Full TypeScript support throughout

## Contributing

This project uses standard chess libraries to ensure correctness and maintainability. When adding chess-related features:

1. Use the utilities in `src/utils/chess/`
2. Refer to [chessops documentation](https://github.com/lichess-org/chessops)
3. Maintain backward compatibility with existing board representations

## License

MIT
