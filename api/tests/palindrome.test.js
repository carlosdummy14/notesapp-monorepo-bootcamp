const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of mexico', () => {
  const result = palindrome('mexico')

  expect(result).toBe('ocixem')
})

test.skip('palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
