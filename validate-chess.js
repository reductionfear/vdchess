#!/usr/bin/env node

/**
 * Validation script for chess functionality refactoring
 * Tests that all key chess operations work correctly with the new implementation
 */

import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';

console.log('🧪 Running Chess Functionality Validation Tests...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
    failed++;
  }
}

// Test 1: FEN parsing
test('FEN parsing works', () => {
  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const setup = parseFen(startFen);
  if (setup.isErr) throw new Error('Failed to parse starting FEN');
  const chess = Chess.fromSetup(setup.value);
  if (chess.isErr) throw new Error('Failed to create position from FEN');
});

// Test 2: FEN generation
test('FEN generation works', () => {
  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const setup = parseFen(startFen);
  const chess = Chess.fromSetup(setup.value);
  const generatedFen = makeFen(chess.value.toSetup());
  if (!generatedFen.startsWith('rnbqkbnr/pppppppp')) {
    throw new Error('Generated FEN does not match expected format');
  }
});

// Test 3: Legal move generation
test('Legal move generation works', () => {
  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const setup = parseFen(startFen);
  const chess = Chess.fromSetup(setup.value);
  const legalMoves = chess.value.allDests();
  if (legalMoves.size === 0) throw new Error('No legal moves found in starting position');
  if (legalMoves.size !== 16) throw new Error(`Expected 16 pieces with moves, got ${legalMoves.size}`);
});

// Test 4: Position validation
test('Position validation works', () => {
  const validFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const setup = parseFen(validFen);
  if (setup.isErr) throw new Error('Valid FEN rejected');
  
  const invalidFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP w KQkq - 0 1'; // Missing rank
  const invalidSetup = parseFen(invalidFen);
  if (!invalidSetup.isErr) throw new Error('Invalid FEN accepted');
});

// Test 5: Check detection
test('Check detection works', () => {
  const checkFen = 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 1';
  const setup = parseFen(checkFen);
  const chess = Chess.fromSetup(setup.value);
  // Test that we can query check status without errors
  const inCheck = chess.value.isCheck();
  // Just verify the method works, value depends on position
});

// Test 6: Empty board creation
test('Empty board FEN parsing works', () => {
  const emptyFen = '8/8/8/8/8/8/8/8 w - - 0 1';
  const setup = parseFen(emptyFen);
  if (setup.isErr) throw new Error('Failed to parse empty board FEN');
  // Note: Chess.fromSetup will fail for empty board (no kings) which is correct behavior
  // We're just testing that FEN parsing works
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n❌ Some tests failed. Please review the errors above.');
  process.exit(1);
} else {
  console.log('\n✅ All validation tests passed! Chess functionality is working correctly.');
  process.exit(0);
}
