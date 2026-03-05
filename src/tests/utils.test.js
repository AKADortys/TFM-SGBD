const serviceUtil = require("../utils/service.util");

describe("Utils: Service Util (Chiffrement)", () => {
  it("devrait chiffrer une chaîne de caractères", () => {
    const input = "MonSuperMotDePasse";
    const hashed = serviceUtil.hashToken(input);

    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(input); // Le hash doit être différent de l'original
  });

  it("devrait être déterministe (même entrée = même sortie)", () => {
    const input = "test@test.com";
    const hash1 = serviceUtil.hashToken(input);
    const hash2 = serviceUtil.hashToken(input);

    expect(hash1).toBe(hash2);
  });

  it("devrait produire des hash différents pour des entrées différentes", () => {
    const hash1 = serviceUtil.hashToken("A");
    const hash2 = serviceUtil.hashToken("B");

    expect(hash1).not.toBe(hash2);
  });
});
