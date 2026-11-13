import { test, expect } from "@playwright/test";
import { api, uniqueName } from "../support/api";

test.describe("Settings", () => {
  test("creates a group with a description", async ({ page, request }) => {
    const name = uniqueName("Design");
    await page.goto("/settings/groups");
    await page.getByRole("button", { name: /New group/ }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name").fill(name);
    await dialog.getByLabel("Description").fill("Owns the design system and the brand guide.");
    await dialog.getByRole("button", { name: "Continue" }).click();
    await expect(dialog.getByText(/add people/i).first()).toBeVisible();
    await page.keyboard.press("Escape");

    await page.reload();
    await expect(page.getByText(name)).toBeVisible();
    const { groups } = await api(request, "groups.list", {});
    const group = groups.find((g: { name: string }) => g.name === name);
    expect(group?.description).toBe("Owns the design system and the brand guide.");
  });
});
