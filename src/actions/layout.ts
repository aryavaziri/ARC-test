'use server'
import { handleWithTryCatch } from "@/lib/helpers";
import sequelize from "@/lib/Sequelize";
import { PageLayout } from "@/models/Layout/PageLayout";
import { TCreatePageLayout, TPageLayout } from "@/types/layouts";


export const saveSchema = async (payload: TCreatePageLayout | TPageLayout) => {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    console.log(payload)
    const isEdit = 'id' in payload;
    if (isEdit) {
      const page = await PageLayout.findByPk(payload.id)
      if (page) {
        await page.update(payload);
        return page.id
      }
    } else {
      const page = await PageLayout.create(payload)
      return page.id
    }
  });
}

export const getSchema = async (id: string) => {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    const page = await PageLayout.findByPk(id)
    return page?.get({ plain: true })
  });
}

export const delSchema = async (id: string) => {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    const page = await PageLayout.findByPk(id)
    await page?.destroy()
    return id
  });
}

export const getAllSchema = async () => {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    const pages = await PageLayout.findAll()
    return pages.map(p => ({ id: p.id, name: p.name }))
    return pages.map(p => p.get({ plain: true }))
  });
}