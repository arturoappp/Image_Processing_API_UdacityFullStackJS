import FileManager from "../../processor/FileManager";

describe('Test FileHelper functions', () => {

    let imgList: string[];
    beforeAll(async function () {
        imgList = await FileManager.getImgList()
    });

    it('Image list contain fjord', async () => {
            expect(imgList).toContain("fjord");
        }
    )

    it('When file name is in list it return true', async () => {
            expect(await FileManager.isImgInList("encenadaport")).toBeTruthy();
        }
    )

    it('When file name is in list it return false', async () => {
            expect(await FileManager.isImgInList("encenadaportWrong")).toBeFalsy();
        }
    )

    it('Image list is not empty', async () => {
            expect(imgList).toBeTruthy();
        }
    )

    it('Get path when call getOrCreateThumb', async () => {
            let data = await FileManager.getPathOrCreateThumb({name: "fjord", height: "200", width: "200"});
            console.log(data)
            expect(data[0]).toContain("fjord-200-200.JPG");
        }
    )

    it('Get error when file name is wrong on call getOrCreateThumb', async () => {
            let data = await FileManager.getPathOrCreateThumb({name: "fjordwrong", height: "200", width: "200"});
            console.log(data)
            expect(data[1]).toBeTruthy();
        }
    )
});