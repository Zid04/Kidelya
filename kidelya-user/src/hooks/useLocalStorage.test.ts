import { renderHook, act } from "@testing-library/react"
import { useLocalStorage } from "./useLocalStorage"

beforeEach(() => {
  localStorage.clear()
})

it("retourne la valeur initiale si rien n'est stocké", () => {
  const { result } = renderHook(() => useLocalStorage("cle", "defaut"))
  expect(result.current[0]).toBe("defaut")
})

it("retourne la valeur stockée en localStorage si elle existe", () => {
  localStorage.setItem("cle", JSON.stringify("stockée"))
  const { result } = renderHook(() => useLocalStorage("cle", "defaut"))
  expect(result.current[0]).toBe("stockée")
})

it("met à jour la valeur en mémoire et en localStorage", () => {
  const { result } = renderHook(() => useLocalStorage("cle", "defaut"))

  act(() => {
    result.current[1]("nouvelle")
  })

  expect(result.current[0]).toBe("nouvelle")
  expect(localStorage.getItem("cle")).toBe(JSON.stringify("nouvelle"))
})

it("retourne la valeur initiale si le localStorage contient du JSON invalide", () => {
  localStorage.setItem("cle", "{{json_cassé")
  const { result } = renderHook(() => useLocalStorage("cle", "fallback"))
  expect(result.current[0]).toBe("fallback")
})

it("fonctionne avec des objets complexes", () => {
  const initial = { nom: "Alice", age: 5 }
  const { result } = renderHook(() => useLocalStorage("enfant", initial))

  act(() => {
    result.current[1]({ nom: "Bob", age: 7 })
  })

  expect(result.current[0]).toEqual({ nom: "Bob", age: 7 })
  expect(JSON.parse(localStorage.getItem("enfant")!)).toEqual({ nom: "Bob", age: 7 })
})
