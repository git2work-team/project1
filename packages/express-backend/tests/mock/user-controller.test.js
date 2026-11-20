import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import bcrypt from "bcryptjs";
import User from "../../tables/user.js";
import userController from "../../controllers/user-controller.js";
import { mockRes } from "../helper/mock-res.js";

process.env.JWT_SECRET = "test-secret";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("createUser", () => {
  test("rejects passwords shorter than 8 characters", async () => {
    const createSpy = jest.spyOn(User, "create");
    const req = { body: { fullName: "A", email: "a@b.com", password: "short" } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Password must be at least 8 characters" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("rejects passwords longer than 72 characters", async () => {
    const createSpy = jest.spyOn(User, "create");
    const req = { body: { fullName: "A", email: "a@b.com", password: "a".repeat(73) } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Password must be at most 72 characters" });
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("rejects a missing password", async () => {
    const createSpy = jest.spyOn(User, "create");
    const req = { body: { fullName: "A", email: "a@b.com" } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("hashes the password and never stores it in plain text", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed!");
    jest.spyOn(User, "create").mockResolvedValue({ _id: "1", fullName: "A" });
    const req = { body: { fullName: "A", email: "a@b.com", password: "longenough" } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("longenough", 10);
    expect(User.create).toHaveBeenCalledWith({
      fullName: "A",
      email: "a@b.com",
      passwordHash: "hashed!",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      token: expect.any(String),
      user: { _id: "1", fullName: "A" },
    });
  });

  test("returns 409 when the email is already used", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed!");
    jest.spyOn(User, "create").mockRejectedValue({ code: 11000 });
    const req = { body: { fullName: "A", email: "a@b.com", password: "longenough" } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "An account with this email already exists" });
  });

  test("returns 400 when the name or email is missing", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed!");
    jest.spyOn(User, "create").mockRejectedValue({ name: "ValidationError" });
    const req = { body: { password: "longenough" } };
    const res = mockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Please fill in your name and a valid email" });
  });
});

describe("loginUser", () => {
  // findOne(...).select(...) is a chain, so the fake findOne returns an object with select
  function mockFindOne(user) {
    const select = jest.fn().mockResolvedValue(user);
    jest.spyOn(User, "findOne").mockReturnValue({ select });
    return select;
  }

  test("returns the user when the password is correct", async () => {
    const user = { _id: "1", fullName: "A", passwordHash: "hashed!" };
    const select = mockFindOne(user);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    const req = { body: { email: " A@B.com ", password: "longenough" } };
    const res = mockRes();

    await userController.loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "a@b.com" });
    expect(select).toHaveBeenCalledWith("+passwordHash");
    expect(bcrypt.compare).toHaveBeenCalledWith("longenough", "hashed!");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ token: expect.any(String), user });
  });

  test("returns 401 when the password is wrong", async () => {
    mockFindOne({ _id: "1", passwordHash: "hashed!" });
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
    const req = { body: { email: "a@b.com", password: "wrongpassword" } };
    const res = mockRes();

    await userController.loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Incorrect email or password" });
  });

  test("returns 401 when no account has that email", async () => {
    mockFindOne(null);
    const compareSpy = jest.spyOn(bcrypt, "compare");
    const req = { body: { email: "nobody@b.com", password: "longenough" } };
    const res = mockRes();

    await userController.loginUser(req, res);

    expect(compareSpy).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Incorrect email or password" });
  });

  test("returns 400 when the email or password is missing", async () => {
    const findSpy = jest.spyOn(User, "findOne");
    const res = mockRes();

    await userController.loginUser({ body: { email: "a@b.com" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Email and password are required" });
    expect(findSpy).not.toHaveBeenCalled();
  });
});

describe("getUserById", () => {
  test("returns the user when found", async () => {
    const user = { _id: "1", fullName: "A" };
    jest.spyOn(User, "findById").mockResolvedValue(user);
    const res = mockRes();

    await userController.getUserById({ params: { id: "1" }, user: { id: "1" } }, res);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test("returns 404 when the user does not exist", async () => {
    jest.spyOn(User, "findById").mockResolvedValue(null);
    const res = mockRes();

    await userController.getUserById({ params: { id: "1" }, user: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  test("returns 403 when looking up another user", async () => {
    const findSpy = jest.spyOn(User, "findById");
    const res = mockRes();

    await userController.getUserById({ params: { id: "2" }, user: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(findSpy).not.toHaveBeenCalled();
  });
});

describe("updateUser", () => {
  test("only updates fullName and email, ignoring other fields", async () => {
    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue({ _id: "1", fullName: "B" });
    const req = {
      params: { id: "1" },
      user: { id: "1" },
      body: { fullName: "B", email: "b@b.com", passwordHash: "sneaky" },
    };
    const res = mockRes();

    await userController.updateUser(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { fullName: "B", email: "b@b.com" },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith({ _id: "1", fullName: "B" });
  });

  test("only changes the fields that were sent", async () => {
    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue({ _id: "1" });
    const req = { params: { id: "1" }, user: { id: "1" }, body: { bio: "Hi" } };

    await userController.updateUser(req, mockRes());

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { bio: "Hi" },
      { new: true, runValidators: true }
    );
  });

  test("trims the lists and drops empty items", async () => {
    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue({ _id: "1" });
    const req = {
      params: { id: "1" },
      user: { id: "1" },
      body: { allergies: [" peanuts ", ""], dislikedFoods: ["  ", "pork"] },
    };

    await userController.updateUser(req, mockRes());

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { allergies: ["peanuts"], dislikedFoods: ["pork"] },
      { new: true, runValidators: true }
    );
  });

  test("returns 400 when a list is not a list of text", async () => {
    const updateSpy = jest.spyOn(User, "findByIdAndUpdate");
    const res = mockRes();

    await userController.updateUser(
      { params: { id: "1" }, user: { id: "1" }, body: { allergies: "peanuts" } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  test("returns 400 when the bio is not text", async () => {
    const updateSpy = jest.spyOn(User, "findByIdAndUpdate");
    const res = mockRes();

    await userController.updateUser(
      { params: { id: "1" }, user: { id: "1" }, body: { bio: { $gt: "" } } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  describe("profile photo", () => {
    const originalCloudName = process.env.CLOUDINARY_CLOUD_NAME;

    beforeEach(() => {
      process.env.CLOUDINARY_CLOUD_NAME = "mycloud";
    });

    afterEach(() => {
      process.env.CLOUDINARY_CLOUD_NAME = originalCloudName;
    });

    test("saves a photo from the user's own folder and works out the id from the URL", async () => {
      jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue({ _id: "1" });
      const url = "https://res.cloudinary.com/mycloud/image/upload/v123/profile-photos/1/me.jpg";
      const req = {
        params: { id: "1" },
        user: { id: "1" },
        // an id sent by the client is ignored
        body: { profileImageUrl: url, profileImagePublicId: "someone-elses/photo" },
      };

      await userController.updateUser(req, mockRes());

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { profileImageUrl: url, profileImagePublicId: "profile-photos/1/me" },
        { new: true, runValidators: true }
      );
    });

    test("rejects a photo in another user's folder or another folder", async () => {
      const updateSpy = jest.spyOn(User, "findByIdAndUpdate");
      const base = "https://res.cloudinary.com/mycloud/image/upload/";
      const urls = [
        `${base}profile-photos/2/me.jpg`,
        `${base}review-photos/abc.jpg`,
        `${base}profile-photos/1/../2/me.jpg`,
        `${base}profile-photos/1/`,
      ];

      for (const profileImageUrl of urls) {
        const res = mockRes();
        await userController.updateUser(
          { params: { id: "1" }, user: { id: "1" }, body: { profileImageUrl } },
          res
        );
        expect(res.status).toHaveBeenCalledWith(400);
      }
      expect(updateSpy).not.toHaveBeenCalled();
    });

    test("rejects a photo from another website", async () => {
      const updateSpy = jest.spyOn(User, "findByIdAndUpdate");
      const res = mockRes();

      await userController.updateUser(
        {
          params: { id: "1" },
          user: { id: "1" },
          body: { profileImageUrl: "https://evil.example.com/me.jpg" },
        },
        res
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    test("rejects another Cloudinary account that starts with the same name", async () => {
      const updateSpy = jest.spyOn(User, "findByIdAndUpdate");
      const res = mockRes();

      await userController.updateUser(
        {
          params: { id: "1" },
          user: { id: "1" },
          body: { profileImageUrl: "https://res.cloudinary.com/mycloud-other/image/upload/a.jpg" },
        },
        res
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    test("null removes the photo and its id", async () => {
      jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue({ _id: "1" });
      const req = { params: { id: "1" }, user: { id: "1" }, body: { profileImageUrl: null } };

      await userController.updateUser(req, mockRes());

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { profileImageUrl: null, profileImagePublicId: null },
        { new: true, runValidators: true }
      );
    });
  });

  test("returns 404 when the user does not exist", async () => {
    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue(null);
    const res = mockRes();

    await userController.updateUser({ params: { id: "1" }, user: { id: "1" }, body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("returns 403 and does not update another user", async () => {
    const updateSpy = jest.spyOn(User, "findByIdAndUpdate");
    const res = mockRes();

    await userController.updateUser(
      { params: { id: "2" }, user: { id: "1" }, body: { fullName: "Hacked" } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(updateSpy).not.toHaveBeenCalled();
  });
});

describe("deleteUser", () => {
  test("returns 204 on success", async () => {
    jest.spyOn(User, "findByIdAndDelete").mockResolvedValue({ _id: "1" });
    const res = mockRes();

    await userController.deleteUser({ params: { id: "1" }, user: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test("returns 404 when the user does not exist", async () => {
    jest.spyOn(User, "findByIdAndDelete").mockResolvedValue(null);
    const res = mockRes();

    await userController.deleteUser({ params: { id: "1" }, user: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("returns 403 and does not delete another user", async () => {
    const deleteSpy = jest.spyOn(User, "findByIdAndDelete");
    const res = mockRes();

    await userController.deleteUser({ params: { id: "2" }, user: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});
